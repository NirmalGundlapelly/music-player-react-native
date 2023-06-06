import React from 'react';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import musicData from '../data/data';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Appearance,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';



interface IProps {
  navigation:any
}

interface IState {
  isDarkMode:boolean
}

const {width, height} = Dimensions.get('window');

class Home extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {isDarkMode: Appearance.getColorScheme()=='dark'? true : false };

    // checking current theme
    Appearance.addChangeListener(theme => {
      console.log('theme', theme);
      theme.colorScheme == 'dark'
        ? this.setState({isDarkMode: true})
        : this.setState({isDarkMode: false});
    });
  }
  

  
  renderMusicItem = (item: any) => {
    const {isDarkMode} = this.state;
    const styles = styling(isDarkMode);
    const images = item.artwork;

    return (
      <TouchableOpacity onPress={()=> this.props.navigation.navigate('SongScreen', {...item})}>
      <View style={styles.musicItemContainer}>
        <Image
          style={{width: width/4, height: height/9}}
          resizeMode="cover"
          source={{uri: images}}
        />
        <View style={styles.mustTextContainer}>
          <Text style={styles.musicTitle}>{item.title}</Text>
          <Text style={styles.musicDesc}>{item.album}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {isDarkMode} = this.state;
    const styles = styling(isDarkMode);
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.filterContainer}>
            <MaterialIcons
              name="sort"
              size={27}
              color={isDarkMode ? 'white' : 'black'}
            />
            <Text style={styles.musicText}>Music Player</Text>
          </View>
          <View style={{marginRight: 10}}>
            <Icon
              name="search"
              size={27}
              color={isDarkMode ? 'white' : 'black'}
            />
          </View>
        </View>
        {/* Song Types */}
        <View style={styles.audioTypeContainer}>
          <Text style={styles.audioTypeText}>Songs</Text>
          <Text style={styles.audioTypeText}>Artists</Text>
          <Text style={styles.audioTypeText}>Playlist</Text>
          <Text style={styles.audioTypeText}>Albums</Text>
          <Text style={styles.audioTypeText}>Folder</Text>
          <Icon
            name="shuffle"
            size={27}
            color={isDarkMode ? 'white' : 'black'}
          />
          <MIcon
            name="playlist-plus"
            size={27}
            color={isDarkMode ? 'white' : 'black'}
          />
        </View>
        <View style={styles.songsContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={musicData}
            renderItem={({item}) => this.renderMusicItem(item)}
          />
        </View>
        
      </SafeAreaView>
    );
  }
}
const styling = (theme: boolean) =>
  StyleSheet.create({
    backgroundStyle:{
      backgroundColor:theme?"black":"white"
    },


    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    musicText: {
      fontWeight: '600',
      color: theme ? 'white' : 'black',
      marginLeft: 20,
      fontSize: 21,
    },
    audioTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      marginTop: 15,
    },
    audioTypeText: {
      color: theme ? 'white' : 'black',
      fontWeight: '500',
    },
    songsContainer: {
      height: height / 1.19 ,
    },
    musicItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 10,
    },
    mustTextContainer: {
      marginLeft: 20,
    },
    musicTitle: {
      color: theme ? 'white' : 'black',
      fontSize: 18,
      fontWeight: '600',
    },
    musicDesc: {
      color: theme ? '#b8b3a7' : 'black',
      marginTop:10
    },
  });

export default Home;
