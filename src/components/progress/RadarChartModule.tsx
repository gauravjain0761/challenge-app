import {Colors} from '@/constants/Colors';
import {getCategoryDisplayName, getFontSize} from '@/utils/responsiveFn';
import {CategoryProgress, ProgressMetricsResponse} from '@/validation/schemas';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text as RNText,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Line, Polygon, Text as SvgText, G, Rect} from 'react-native-svg';
import Device from 'react-native-device-info';
import {CategoryFilter, progressCategories} from '@/types/enums';
import {get} from 'lodash';

type Props = {
  item: CategoryProgress;
  listOfValue: any[];
  chartSize?: boolean;
};

type Tooltip = {
  x: number;
  y: number;
  label: string;
  percentage: number;
  visible: boolean;
  count: number;
};

const RadarChartModule = ({item, listOfValue, chartSize = false}: Props) => {
  const {width} = Dimensions.get('window');
  const size = Device.isTablet()
    ? width - getFontSize(40)
    : chartSize
    ? width - getFontSize(12)
    : width - getFontSize(8);
  const center = size / 2;
  const levels = 3;
  const radius = center - getFontSize(8);

  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const tooltipTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const categories = useMemo(() => {
    const map = new Map(
      item?.map(cp => [
        cp.category.toLowerCase(),
        {
          percentage: cp.percentage,
          count: cp.count,
          totalCount: cp?.totalCount ?? '',
        },
      ]),
    );
    const newList = listOfValue?.length > 0 ? listOfValue : progressCategories;

    return newList.map(entry => {
      const data = map.get(entry.category.toLowerCase()) ?? {
        percentage: 0,
        count: 0,
        totalCount: 0,
      };

      return {
        label: entry.category.toUpperCase(),
        percentage: data.percentage,
        count: data.count,
        level: (data.percentage / 100) * levels,
        totalCount: data.totalCount,
      };
    });
  }, [item]);

  const angleSlice = (2 * Math.PI) / categories.length;

  const getPoint = (level: number, i: number) => {
    const angle = i * angleSlice - Math.PI / 2;
    const r = (radius / levels) * level;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return [x, y];
  };

  const polygonPoints = categories.map((cat, i) => getPoint(cat.level, i));
  const pointsString = polygonPoints.map(p => p.join(',')).join(' ');

  const handleLabelPress = (cat: any, i: number) => {
    const [x, y] = getPoint(levels + 0.4, i);

    // Clear existing timeout if active
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }

    // Show tooltip
    setTooltip({
      x,
      y,
      label: cat.label,
      percentage: cat.percentage,
      count: cat.count,
      visible: true,
    });

    // Auto-dismiss after 5 seconds
    tooltipTimeout.current = setTimeout(() => {
      setTooltip(null);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  const addSpace = (n: number) => {
    if (n === 0) {
      return 0.8;
    } else if (n === 1) {
      return 0.8;
    } else if (n === 2) {
      return 1;
    } else if (n === 3) {
      return 1;
    } else if (n === 4) {
      return 0.4;
    } else if (n === 5) {
      return 1;
    } else if (n === 6) {
      return 0.8;
    } else if (n === 7) {
      return 0.8;
    } else {
      return 0.9;
    }
  };

  return (
    <Pressable
      style={styles.fullArea}
      onPress={() => {
        if (tooltip?.visible) setTooltip(null);
      }}>
      <View style={styles.wrapper}>
        <Svg width={size} height={size}>
          {/* Concentric polygons */}
          {[...Array(levels)].map((_, lvl) => {
            const r = ((lvl + 1) / levels) * radius;
            const pts = categories
              .map((_, i) => {
                const angle = i * angleSlice - Math.PI / 2;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <Polygon
                key={`lvl-${lvl}`}
                points={pts}
                stroke="#444"
                strokeWidth={1}
                fill="none"
              />
            );
          })}

          {/* Axis lines */}
          {categories.map((cat, i) => {
            const [x, y] = getPoint(levels, i);
            return (
              <React.Fragment key={`axis-${i}`}>
                {/* Visible Line */}
                <Line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#666"
                  strokeWidth={2}
                />

                {/* Invisible touch line */}
                <Line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="transparent"
                  strokeWidth={20} // Large hit area
                  onPress={e => {
                    e.stopPropagation?.();
                    handleLabelPress(cat, i);
                  }}
                  pointerEvents="auto"
                />
              </React.Fragment>
            );
          })}

          {/* Data polygon */}
          {pointsString && (
            <Polygon
              points={pointsString}
              fill={Colors.orange}
              fillOpacity={0.5}
              stroke={Colors.orange}
              strokeWidth={2}
            />
          )}

          {/* Labels */}
          {categories.map((cat, i) => {
            const [x, y] = getPoint(levels + addSpace(i), i); // 0.9 → more padding
            const hitAreaSize = 30; // adjust as needed for touch target size

            return (
              <G key={`label-${i}`}>
                <Rect
                  x={x - hitAreaSize / 2}
                  y={y - hitAreaSize / 2}
                  width={hitAreaSize}
                  height={hitAreaSize}
                  fill="transparent"
                  onPress={e => {
                    e.stopPropagation?.();
                    handleLabelPress(cat, i);
                  }}
                />
                <SvgText
                  x={x}
                  y={y}
                  fontSize={getFontSize(1.5)}
                  fill={Colors.white}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  onPress={e => {
                    e.stopPropagation?.(); // prevent outside press dismiss
                    handleLabelPress(cat, i);
                  }}>
                  {cat.label === CategoryFilter.MIND ? 'Mindset' : cat.label}
                </SvgText>
                <SvgText
                  x={x}
                  y={y}
                  dy={20} // push down cleanly
                  fontSize={getFontSize(1.8)}
                  fill={Colors.white}
                  fontWeight="bold"
                  textAnchor="middle">
                  {cat?.count ? '+' + cat.count : ''}
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {/* Tooltip Popup */}
        {tooltip?.visible && (
          <LinearGradient
            colors={[Colors.orangeOpacity, '#000', '#000']}
            style={[
              styles.tooltip,
              {
                top: tooltip.y - 30,
                left: tooltip.x - 50,
              },
            ]}
            start={{x: 0, y: 0.5}}
            end={{x: 0.9, y: 0}}>
            <RNText style={styles.tooltipText}>
              {tooltip.label}: {tooltip.percentage}%{'\n'}Count: {tooltip.count}
            </RNText>
          </LinearGradient>
        )}
      </View>
    </Pressable>
  );
};

export default RadarChartModule;

const styles = StyleSheet.create({
  fullArea: {
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: Colors.orange,
    //
    borderRadius: 6,
    zIndex: 10,
  },
  tooltipText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 8,
  },
});
