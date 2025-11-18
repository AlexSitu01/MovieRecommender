import React, { useRef, useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, FlatList as FlatListType, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

type NumberPickerProps = {
  selected: number;
  setSelected: (value: number) => void;
  itemHeight?: number;
  width?: number;
};

const DATA = Array.from({ length: 10 }, (_, i) => i + 1);
const { height: windowHeight } = Dimensions.get("window");

export default function NumberPicker({
  selected,
  setSelected,
  itemHeight = 50,
  width = 60,
}: NumberPickerProps) {
  const flatListRef = useRef<FlatListType<number>>(null);
  const visibleItems = 3;
  const [liveIndex, setLiveIndex] = useState(DATA.indexOf(selected));

  useEffect(() => {
    const index = DATA.indexOf(selected);
    if (index >= 0) {
      flatListRef.current?.scrollToIndex({ index, animated: false });
      setLiveIndex(index);
    }
  }, [selected]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(DATA.length - 1, index));
    setLiveIndex(clampedIndex); // live preview
  };

  const handleScrollEnd = () => {
    // Snap to nearest item
    const clampedIndex = Math.max(0, Math.min(DATA.length - 1, liveIndex));
    flatListRef.current?.scrollToIndex({ index: clampedIndex, animated: true });
    if (DATA[clampedIndex] !== selected) {
      setSelected(DATA[clampedIndex]); // final selection
    }
  };

  return (
    <View
      className="relative overflow-hidden"
      style={{ height: itemHeight * visibleItems, width }}
    >
      {/* Highlight zone */}
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 border-y border-gray-300 z-10"
        style={{
          top: "50%",
          height: itemHeight,
          marginTop: -itemHeight / 2,
        }}
      />

      <FlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        bounces={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentContainerStyle={{
          paddingVertical: (itemHeight * visibleItems) / 2 - itemHeight / 2,
        }}
        renderItem={({ item, index }) => {
          const distanceFromCenter = Math.abs(index - liveIndex);
          const scale = distanceFromCenter === 0 ? 1.2 : 1 - 0.1 * Math.min(distanceFromCenter, 1); // smooth scale
          const color = distanceFromCenter === 0 ? "white" : "gray";

          return (
            <View
              className="justify-center items-center"
              style={{
                height: itemHeight,
                transform: [{ scale }],
              }}
            >
              <Text className={`font-semibold`} style={{ color, fontSize: distanceFromCenter === 0 ? 24 : 18 }}>
                {item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
