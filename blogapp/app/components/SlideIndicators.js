import {StyleSheet, View} from 'react-native';

export default function SlideIndicators({data, activeSlideIndex}) {
  console.log(activeSlideIndex);
  return data.map((item, index) => {
    console.log('pravi' + index);
    return (
      <View
        key={item.id}
        style={[
          styles.slideIndicator,
          {
            backgroundColor:
              activeSlideIndex === index ? 'gray' : 'transparent',
          },
        ]}
      />
    );
  });
  {
  }
}

const styles = StyleSheet.create({
  slideIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderColor: 'gray',
    borderWidth: 2,
    marginLeft: 5,
  },
});
