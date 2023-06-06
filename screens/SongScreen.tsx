import React, {Component} from 'react';
import {
  Text,
  View,
  Appearance,
  Image,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import IconD from 'react-native-vector-icons/dist/Entypo';
import IconS from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import data from '../data/data';

import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

const {width, height} = Dimensions.get('window');

const events = [
  Event.PlaybackTrackChanged,
  Event.PlaybackError,
  Event.PlaybackQueueEnded,
];

interface IProps {
  route: any;
}

interface IState {
  isDarkMode: boolean;
  selectedMusic: any;
  playIcon: string;
  songIndex:any,
  setIsLastTrack:boolean
}

export default class SongScreen extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isDarkMode: Appearance.getColorScheme() == 'dark' ? true : false,
      selectedMusic: this.props.route.params,
      songIndex: this.props.route.params.id,
      playIcon: 'ios-play-circle',
      setIsLastTrack:false
    };

    // checking current theme
    Appearance.addChangeListener(theme => {
      console.log('theme', theme);
      theme.colorScheme == 'dark'
        ? this.setState({isDarkMode: true})
        : this.setState({isDarkMode: false});
    });
  }

  

  componentDidMount(): void {
    this.setupPlayer();
    this.playbackService();
    console.log(this.state.songIndex)
   
    // this.playSong()

  }

  componentWillUnmount(): void {
    this.resetPlayer;
    console.log("unmounted")
    
  }

  resetPlayer = async () => {
    const details = this.props.route.params;
    await TrackPlayer.reset()
    await TrackPlayer.remove([details]);
  };

  // playSong = async () => {
  //   await TrackPlayer.play();
  // }

  setupPlayer = async () => {
    const details = this.props.route.params;

    const index = details.id;
    console.log(index);

    try {
      await TrackPlayer.setupPlayer({waitForBuffer: true});
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
        },
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      await TrackPlayer.add(data[this.state.songIndex]);
    } catch (error) {
      console.log(error);
    }
  };

  // onPlayMusic = async () => {
  //   await TrackPlayer;
  // }

  playbackService() {
    TrackPlayer.addEventListener(Event.RemotePause, () => {
      console.log('Event.RemotePause');
      TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      console.log('Event.RemotePlay');
      TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
      console.log('Event.RemoteNext');
      TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      console.log('Event.RemotePrevious');
      TrackPlayer.skipToPrevious();
    });
  }

  togglePlayBack = async () => {
    const playBack = await TrackPlayer.getState();
    console.log(playBack);
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      if (playBack === State.Paused || playBack === State.Ready) {
        this.setState({playIcon: 'ios-pause-circle'});
        // setPlayPause('ios-pause-circle');
        await TrackPlayer.play();
      } else {
        this.setState({playIcon: 'ios-play-circle'});
        // setPlayPause('ios-play-circle');
        await TrackPlayer.pause();
      }
    }
  };







  togglePlayPrev = async () => {
    await TrackPlayer.skipToNext()
  }

  render() {
    const details = this.props.route.params;
    console.log(details);
    const image = details.artwork;
    const {isDarkMode} = this.state;
    const styles = styling(isDarkMode);
    return (
      <View style={styles.songContainer}>
        <View style={styles.headerContainer}>
          <Icon
            name="chevron-down"
            size={25}
            color={isDarkMode ? 'white' : 'black'}
          />
          <Text style={styles.musicText}>Music Player</Text>
          <IconD
            name="dots-three-vertical"
            size={25}
            color={isDarkMode ? 'white' : 'black'}
          />
        </View>
        <View style={styles.imageContainer}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 20,
              marginBottom: 19,
              color: isDarkMode ? 'white' : 'black',
            }}>
            Song |{' '}
            <Text style={{color: isDarkMode ? '#c2c0ba' : '#454442'}}>
              Lyrics
            </Text>
          </Text>
          <Image
            style={{borderRadius: 30, width: width / 1.2, height: height / 2.5}}
            resizeMode="cover"
            source={{uri: image}}
          />
          <View style={styles.songNameContainer}>
            <Text style={styles.songNameText}>{details.title}</Text>
            <Text style={styles.songDesText}>{details.artist}</Text>
          </View>
          <View style={styles.iconContainer}>
            <IconS
              name="sound"
              size={25}
              color={isDarkMode ? 'white' : 'black'}
            />
            <MaterialIcons
              name="sort"
              size={25}
              color={isDarkMode ? 'white' : 'black'}
            />
            <Icon
            name="shuffle"
            size={27}
            color={isDarkMode ? 'white' : 'black'}
          />
            <MaterialIcons
              name="favorite"
              size={25}
              color={isDarkMode ? 'white' : 'black'}
            />
          </View>
          <View style={styles.songBarContainer}>
            <View style={styles.songBarFilled}></View>
            <View style={styles.songBarEmpty}></View>
          </View>
          <View style={styles.songBarTimeContainer}>
            <Text style={styles.songTime}>2:53</Text>
            <Text style={styles.songTime}>4:42</Text>
          </View>
          <View style={styles.songArrowButtonsContainer}>
            <IconS
          
              name="stepbackward"
              size={37}
              color={isDarkMode ? 'white' : 'black'}
            />
            <TouchableWithoutFeedback onPress={this.togglePlayBack}>
              <Icon
                name={this.state.playIcon}
                // name="pause"
                size={47}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableWithoutFeedback>
            <IconS
              onPress={this.togglePlayPrev}
              name="stepforward"
              size={37}
              color={isDarkMode ? 'white' : 'black'}
            />
          </View>
        </View>
      </View>
    );
  }
}
const styling = (theme: boolean) =>
  StyleSheet.create({
    songContainer: {
      backgroundColor: theme ? '#33322f' : '#d6d4ce',
      padding: 20,
      height: height / 1.031,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    musicText: {
      color: theme ? 'white' : 'black',
      fontSize: 25,
      fontWeight: '600',
    },
    imageContainer: {
      marginTop: 50,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    songNameContainer: {
      marginTop: 40,
      alignItems: 'center',
    },
    songNameText: {
      color: theme ? 'white' : 'black',
      fontSize: 22,
      fontWeight: '600',
    },
    songDesText: {
      color: theme ? '#ccc9c0' : '#696764',
      fontSize: 18,
      fontWeight: '500',
    },
    iconContainer: {
      flexDirection: 'row',
      padding: 10,
      justifyContent: 'space-between',
      width: width / 1.2,
      marginTop: 20,
    },
    songBarFilled: {
      backgroundColor: theme ? 'white' : 'black',
      width: width / 2.3,
      height: 3,
    },
    songBarEmpty: {
      backgroundColor: theme ? 'black' : 'white',
      width: width / 3,
      height: 3,
    },
    songBarContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    songBarTimeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width / 1.3,
      marginTop: 15,
    },
    songTime: {
      color: theme ? 'white' : 'black',
    },
    songArrowButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: width / 2,
    },
  });
