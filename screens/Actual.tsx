import {
  Text,
  View,
  Appearance,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert,
  Modal,
} from 'react-native';
import React, {Component} from 'react';
import Slider from '@react-native-community/slider';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import IconD from 'react-native-vector-icons/dist/Entypo';
import IconS from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import data from '../data/data';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
  useProgress,
} from 'react-native-track-player';

const {width, height} = Dimensions.get('window');

interface IProps {
  navigation: any;
}
interface IState {
  isDarkMode: any;
  index: number;
  playing: boolean;
  modalVisible: boolean;
  time: number;
  secs: number;
  trackArtwork: string;
  trackTitle: string;
  trackArtist: string;
  duration: number;
  progress: number;
}
class ActualHome extends Component<IProps, IState> {
  progressInterval: number | undefined;
  constructor(props: any) {
    super(props);
    this.state = {
      isDarkMode: Appearance.getColorScheme() === 'dark' ? true : false,
      index: 0,
      playing: false,
      modalVisible: false,
      time: 0,
      secs: 0,
      trackArtwork: '',
      trackTitle: '',
      trackArtist: '',
      duration: 0,
      progress: 0,
    };

    Appearance.addChangeListener(theme => {
      theme.colorScheme === 'dark'
        ? this.setState({isDarkMode: true})
        : this.setState({isDarkMode: false});
    });
  }

  async componentDidMount(): Promise<void> {
    try {
      await TrackPlayer.setupPlayer().then(() => {
        TrackPlayer.add(data);

        TrackPlayer.addEventListener(
          Event.PlaybackTrackChanged,
          this.onTrackChange,
        );
      });
      await TrackPlayer.getDuration().then(duration =>
        this.setState({duration: duration}),
      );
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);

      await TrackPlayer.setRepeatMode(RepeatMode.Queue);

      this.progressInterval = setInterval(this.getProgress, 1000);
    } catch (error) {
      console.log(error, 'error');
    }
  }
  onTrackChange = async (music: {nextTrack: number}) => {
    console.log(music, `data is ${data[music.nextTrack].artist}`);
    const {artwork, artist, title, duration} = await data[music.nextTrack];
    this.setState({
      trackArtwork: artwork,
      trackTitle: title,
      trackArtist: artist,
      duration: duration,
      progress: 0,
    });
  };
  getProgress = async () => {
    const position = await TrackPlayer.getPosition();
    this.setState({progress: position});
  };

  onSliderValueChange = async (value: number) => {
    await TrackPlayer.seekTo(value);
    this.setState({progress: value});
  };

  async getInfo() {
    try {
      const info = await SoundPlayer.getInfo(); // Also, you need to await this because it is async
      console.log('getInfo', info); // {duration: 12.416, currentTime: 7.691}
      let mins = (info.currentTime / 60).toString().padStart(2, '0');
      let secs = (Math.trunc(info.duration) % 60).toString().padStart(2, '0');
      this.setState({time: parseInt(mins), secs: parseInt(secs)});
      console.log(mins, secs);
    } catch (e) {
      console.log('There is no song playing', e);
    }
  }

  handlePrevious = async () => {
    if (this.state.index !== 0) {
      this.setState({index: this.state.index - 1});
    }
    const currentplay = await TrackPlayer.getPosition();
    if (currentplay < 10) {
      await TrackPlayer.skipToPrevious();
    } else {
      await TrackPlayer.seekTo(0);
    }
  };

  handleNext = async () => {
    await TrackPlayer.skipToNext();
    this.setState({index: this.state.index + 1});
  };

  playMusic = async () => {
    await TrackPlayer.pause();
    this.setState({playing: false});
  };

  pauseMusic = async () => {
    await TrackPlayer.play();
    this.setState({playing: true});
    console.log(TrackPlayer.getCurrentTrack());
  };
  handleModal = () => {
    this.setState({modalVisible: true});
  };

  renderMusicList = (item: any) => {
    const images = item.artwork;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          try {
            TrackPlayer.skip(item.id-1)
            TrackPlayer.play();
            this.setState({playing: true});
            console.log(item.url);
          } catch (e) {
            Alert.alert('Cannot play the file');
            console.log('cannot play the song file', e);
          }
          this.setState({index: item.id - 1});
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '3%',
            justifyContent: 'flex-start',
          }}>
          <Image
            resizeMode="cover"
            style={{width: '15%', height: '100%', borderRadius: 6}}
            source={{uri: images}}
          />
          <View style={{paddingLeft: '6%'}}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 18,
                color: this.state.isDarkMode ? 'white' : '#1E1E1E',
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontWeight: '200',
                fontSize: 14,
                color: this.state.isDarkMode ? 'white' : '#1E1E1E',
              }}>
              {item.artist}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  format = (seconds: number) => {
    let mins = (seconds / 60).toString().padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  formatTime = (secs: number) => {
    let minutes = Math.floor(secs / 60);
    let seconds = Math.ceil(secs - minutes * 60);

    if (seconds < 10) {
      seconds = seconds;
    }

    return `${minutes}:${seconds}`;
  };

  render() {
    console.log(this.state.duration)
    console.log(this.state.progress)
    const {isDarkMode} = this.state;
    const selectedData = data[this.state.index];
    console.log(this.state.secs, this.state.time);
    const formatprogress = `${Math.floor(this.state.progress / 60)}:${(
      this.state.progress % 60
    )
      .toFixed(0)
      .padStart(2, '0')}`;
    const formatduration = `${Math.floor(this.state.duration / 60)}:${(
      this.state.duration % 60
    )
      .toFixed(0)
      .padStart(2, '0')}`;
    console.log(formatduration);
    console.log(formatprogress);
    return (
      <SafeAreaView
        style={{backgroundColor: this.state.isDarkMode ? '#1E1E1E' : 'white'}}>
        <View style={styles.mainContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '3%',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons
                name="sort"
                size={27}
                color={isDarkMode ? 'white' : 'black'}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  paddingLeft: '2%',
                  color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                }}>
                {' '}
                Music Player
              </Text>
            </View>
            <View>
              <Icon
                name="search"
                size={27}
                color={isDarkMode ? 'white' : 'black'}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              paddingTop: '4%',
            }}>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Songs
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Artists
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Playlist
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Albums
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Folder
            </Text>

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
          <View>
            <FlatList
              data={data}
              renderItem={({item}) => this.renderMusicList(item)}
            />
          </View>
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: !this.state.modalVisible});
            }}>
            <SafeAreaView
              style={{
                backgroundColor: this.state.isDarkMode ? '#2F2F2F' : 'white',
              }}>
              <View style={styles.mainContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5%',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableWithoutFeedback
                      onPress={() => this.setState({modalVisible: false})}>
                      <Icon
                        name="chevron-down"
                        size={25}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    </TouchableWithoutFeedback>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '800',
                        paddingLeft: '20%',
                        textAlign: 'center',
                        color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      }}>
                      {' '}
                      Music Player
                    </Text>
                  </View>
                  <View>
                    <IconD
                      name="dots-three-vertical"
                      size={25}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  </View>
                </View>
                <View style={{height: height / 2}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                    }}>
                    Song <Text> / Lyrics</Text>
                  </Text>
                  <Image
                    style={{
                      width: '70%',
                      height: height / 3,
                      borderRadius: 20,
                      marginTop: '12%',
                      alignSelf: 'center',
                    }}
                    source={{uri: selectedData.artwork}}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: '800',
                      color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      paddingBottom: '3%',
                    }}>
                    {selectedData.title}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      paddingBottom: '5%',
                    }}>
                    {selectedData.artist}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingTop: '7%',
                    paddingBottom: '6%',
                  }}>
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
                    size={25}
                    color={isDarkMode ? 'white' : 'black'}
                  />

                  <MaterialIcons
                    name="favorite"
                    size={25}
                    color={isDarkMode ? 'white' : 'black'}
                  />
                </View>

                <Slider
                  style={{width: width, height: 40}}
                  minimumValue={0}
                  maximumValue={this.state.duration}
                  value={this.state.progress}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                  onSlidingComplete={this.onSliderValueChange}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingTop: '5%',
                    paddingBottom: '50%',
                  }}>
                  <TouchableHighlight onPress={() => this.handlePrevious()}>
                    <IconS
                      name="stepbackward"
                      size={37}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  </TouchableHighlight>

                  {this.state.playing ? (
                    <TouchableHighlight onPress={() => this.playMusic()}>
                      <Icon
                        name="pause"
                        size={35}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    </TouchableHighlight>
                  ) : (
                    <TouchableHighlight onPress={() => this.pauseMusic()}>
                      <Icon
                        name="play"
                        size={35}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    </TouchableHighlight>
                  )}
                  <TouchableHighlight onPress={() => this.handleNext()}>
                    <IconS
                      name="stepforward"
                      size={37}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
        <TouchableHighlight
          onPress={this.handleModal}
          style={{
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            backgroundColor: 'black',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width / 2.5,
            paddingBottom: '20%',
            paddingStart: '4%',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              backgroundColor: 'black',
              width: Dimensions.get('window').width / 1.2,
              height: Dimensions.get('window').width / 2.5,
              paddingBottom: '20%',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: '26%', height: '70%', borderRadius: 8}}
                source={{
                  uri: selectedData.artwork,
                }}
              />
              <View style={{paddingLeft: '5%'}}>
                <Text>{selectedData.title}</Text>
                <Text>{selectedData.artist}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft:width/4.5
              }}>
              <TouchableHighlight onPress={() => this.handlePrevious()}>
                <IconS
                  name="stepbackward"
                  size={30}
                  color={isDarkMode ? 'white' : 'black'}
                />
              </TouchableHighlight>
              {this.state.playing ? (
                <TouchableHighlight onPress={() => this.playMusic()}>
                  <IconS
                    name="pause"
                    size={30}
                    color={isDarkMode ? 'white' : 'black'}
                  />
                </TouchableHighlight>
              ) : (
                <TouchableHighlight onPress={() => this.pauseMusic()}>
                  <Icon
                    name="play"
                    size={30}
                    color={isDarkMode ? 'white' : 'black'}
                  />
                </TouchableHighlight>
              )}
              <TouchableHighlight onPress={() => this.handleNext()}>
                <IconS
                  name="stepforward"
                  size={30}
                  color={isDarkMode ? 'white' : 'black'}
                />
              </TouchableHighlight>
            </View>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: height*1.01,
  },
});

export default ActualHome;
