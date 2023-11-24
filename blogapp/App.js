import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const data = [
  {
    id: '123',
    thumbnail:
      'https://images.unsplash.com/photo-1682695794947-17061dc284dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'THese are climbers',
    author: 'admin',
  },
  {
    id: '1234',
    thumbnail:
      'https://images.unsplash.com/photo-1700578075560-ebacba6e5d22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Tralalala',
    author: 'admin',
  },
  {
    id: '12345',
    thumbnail:
      'https://images.unsplash.com/photo-1699614614470-97206a4e6c62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'novi tile',
    author: 'admin',
  },
];

const width = Dimensions.get('window').width - 20;

export default function App() {
  const [dataToRender, setDataToRender] = useState([]);
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    setVisibleSlideIndex(viewableItems[0]?.index || 0);
  });

  const flatList = useRef();

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const handleScrollTo = index => {
    flatList.current.scrollToIndex({animated: false, index: index});
  };

  const handleFlatListLayout = () => {
    handleScrollTo(1); // Set the initial visible index to the second item
  };

  useEffect(() => {
    const newData = [[...data].pop(), ...data, [...data].shift()];
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
  }, [visibleSlideIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatList}
        data={dataToRender}
        keyExtractor={(item, index) => item.id + index}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onLayout={handleFlatListLayout}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        renderItem={({item}) => {
          return (
            <View>
              <Image
                source={{uri: item.thumbnail}}
                style={{width, height: width / 1.7, borderRadius: 7}}
              />
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
});
