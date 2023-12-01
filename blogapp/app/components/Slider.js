import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SlideIndicators from './SlideIndicators';

const width = Dimensions.get('window').width - 20;
let intervalId;
let currentSlideIndex = 0;

export default function Slider({data, title}) {
  const [dataToRender, setDataToRender] = useState([]);
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    currentSlideIndex = viewableItems[0]?.index || 0;
    setVisibleSlideIndex(currentSlideIndex);
  });

  const flatList = useRef();

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const handleScrollTo = index => {
    flatList.current.scrollToIndex({animated: false, index: index});
  };

  const startSlider = () => {
    intervalId = setInterval(() => {
      if (currentSlideIndex < dataToRender.length - 2) {
        flatList?.current?.scrollToIndex({
          animated: true,
          index: currentSlideIndex + 1,
        });
      } else {
        currentSlideIndex = 0;
      }
    }, 3000);
  };

  const pauseSlider = () => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (dataToRender.length && flatList.current) {
      startSlider();
    }
  }, [dataToRender.length]);

  const handleFlatListLayout = () => {
    handleScrollTo(1); // Set the initial visible index to the second item
  };

  useEffect(() => {
    const newData = [...data.slice(-1), ...data, ...data.slice(0, 1)];
    setDataToRender([...newData]);
  }, [data.length]);

  useEffect(() => {
    // reset slide to first
    if (visibleSlideIndex === dataToRender.length - 1 && dataToRender.length) {
      handleScrollTo(1);
    }
    //reset slide to last
    if (visibleSlideIndex === 0 && dataToRender.length) {
      handleScrollTo(dataToRender.length - 2);
    }
    const lastSlide = visibleSlideIndex === dataToRender.length - 1;
    const firstSlide = visibleSlideIndex === 0;

    if (lastSlide && dataToRender.length) setActiveSlideIndex(0);
    else if (firstSlide && dataToRender.length)
      setActiveSlideIndex(dataToRender.length - 3);
    else setActiveSlideIndex(visibleSlideIndex - 1);
  }, [visibleSlideIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.sliderTitle}>
        <Text style={{fontWeight: '700', color: 'gray', fontSize: 22}}>
          {title}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SlideIndicators data={data} activeSlideIndex={activeSlideIndex} />
        </View>
      </View>
      <FlatList
        ref={flatList}
        data={dataToRender}
        keyExtractor={(item, index) => item.id + index}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onLayout={handleFlatListLayout}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        onScrollBeginDrag={pauseSlider}
        onScrollEndDrag={startSlider}
        renderItem={({item}) => {
          return (
            <View>
              <Image source={{uri: item.thumbnail}} style={styles.slideImg} />
              <View style={{width}}>
                <Text numberOfLines={2} style={styles.slideTitle}>
                  {item.title}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width,
    paddingTop: 50,
  },
  sliderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  slideImg: {width, height: width / 1.7, borderRadius: 7},
  slideTitle: {fontWeight: '700', color: 'gray', fontSize: 22},
});
