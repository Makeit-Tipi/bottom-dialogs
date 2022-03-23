import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';

import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView as SafeAreaViewDefault,
  BackHandler,
  ScrollView,
  Text,
} from 'react-native';

import DefaultIcon from '../Icon';

import styles from './BottomModalHandlerStyle';
import { SafeAreaView as SafeAreaViewIOS } from 'react-native-safe-area-context';

export interface StateProps {}

export interface DispatchProps {}

export interface OwnProps {
  modal: any;
  closeModal: Function;
  iconComponent: any;
  id: string;
  key: string;
}

export type BottomModalHandlerProps = StateProps & DispatchProps & OwnProps;

export type PromptBackAndroidProps = {
  close: any;
};

const PromptBackAndroid = (props: PromptBackAndroidProps) => {
  const { close } = props;

  const handleBackAndroidPressed = useCallback(() => {
    close();
    return true;
  }, [close]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackAndroidPressed);
    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackAndroidPressed
      );
  }, [handleBackAndroidPressed]);

  return null;
};

const BottomModalHandler = (props: BottomModalHandlerProps) => {
  // mapStateToProps
  const { modal, closeModal, iconComponent = DefaultIcon } = props;
  // Allow to dispatch actions
  const [botAnim] = useState(new Animated.Value(0));
  const [heightAnim] = useState(new Animated.Value(0));

  const ScrollViewRef = useRef<any>(null);

  const screenHeight = Dimensions.get('screen').height;
  const windowHeight = Dimensions.get('window').height;
  const navbarHeight = screenHeight - windowHeight;

  const noScroll = useMemo(() => modal?.options?.noScroll, [modal]);

  const SafeView =
    Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewDefault;
  const Icon = iconComponent;
  const ContainerView = noScroll ? View : ScrollView;

  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(100);
  const [contentDisplay, setContentDisplay] = useState(false);

  const handleClose = useCallback(() => {
    if (modal?.options?.noClose) {
      return;
    }

    if (modal.close && typeof modal.close === 'function') {
      modal.close();
    }

    if (closeModal) {
      closeModal(modal?.id);
    } else {
      console.warn('Please provide a closeModal function');
    }
  }, [modal, closeModal]);

  const handleClickOutside = useCallback(
    (e) => {
      if (e === 'out') {
        handleClose();
      }
      return;
    },
    [handleClose]
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(botAnim, {
        toValue: modal?.active ? 1 : 0,
        duration: 200,
        useNativeDriver: Platform.OS === 'ios' ? false : true,
      }),
      Animated.timing(heightAnim, {
        toValue: modal?.active ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (modal?.active && modal?.options?.handleKeyboard) {
        setTimeout(() => {
          if (ScrollViewRef?.current) {
            ScrollViewRef.current!.measure((e: any) => {
              console.log(e);
              // (ox, oy, x, h)
              // setKeyboardVerticalOffset(Dimensions.get('window').height - h);
            });
          }
        }, 500);
      } else {
        setKeyboardVerticalOffset(100);
      }
    });
  }, [modal, ScrollViewRef, botAnim, heightAnim]);

  const renderContent = useCallback(() => {
    if (typeof modal?.content === 'string') {
      return (
        <Text style={{ marginBottom: 30, textAlign: 'center' }}>
          {modal?.content}
        </Text>
      );
    } else {
      return modal?.content;
    }
  }, [modal]);

  useEffect(() => {
    if (!modal?.active) {
      setTimeout(() => {
        setContentDisplay(false);
      }, 500);
    } else {
      return setContentDisplay(true);
    }
  }, [modal]);

  const renderStructure = useCallback(() => {
    return (
      <SafeView
        edges={['left', 'right', 'bottom']}
        style={[
          { flex: 1, flexShrink: 1 },
          Platform.OS === 'android' && {
            marginBottom: navbarHeight,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={() => handleClickOutside('in')}>
          <View style={[styles.wrapper, { paddingBottom: 0 }]}>
            <Animated.View
              style={{
                opacity: botAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[styles.side]}
                  onPress={() => handleClose()}
                >
                  <Icon icon="close" style={{ width: 10 }} />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{modal?.title}</Text>
                </View>
                <View style={styles.side} />
              </View>
            </Animated.View>
            <ContainerView
              style={[noScroll ? { flexShrink: 1 } : { paddingBottom: 20 }]}
              showsVerticalScrollIndicator={false}
            >
              <Icon
                icon={modal?.icon}
                style={{ width: 120, height: 120, marginTop: 20 }}
              />
              <View style={{ flexShrink: 1, marginBottom: 20 }}>
                {contentDisplay && renderContent()}
              </View>
            </ContainerView>
          </View>
        </TouchableWithoutFeedback>
      </SafeView>
    );
  }, [
    modal,
    botAnim,
    navbarHeight,
    handleClickOutside,
    renderContent,
    noScroll,
    contentDisplay,
    handleClose,
  ]);

  const renderMainContainer = useCallback(() => {
    if (modal?.options?.handleKeyboard) {
      return (
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flexShrink: 1 }}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <ContainerView
            style={{ flex: 0, flexGrow: 1 }}
            contentContainerStyle={{ flex: 1 }}
            bounces={false}
            ref={ScrollViewRef}
          >
            {renderStructure()}
          </ContainerView>
        </KeyboardAvoidingView>
      );
    }
    return renderStructure();
  }, [modal, keyboardVerticalOffset, renderStructure]);

  return (
    <TouchableWithoutFeedback onPress={() => handleClickOutside('out')}>
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: botAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-1, 1],
          }),
          opacity: botAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      >
        {modal?.active && Platform.OS === 'android' && (
          <PromptBackAndroid close={handleClose} />
        )}
        <Animated.View
          style={[
            styles.container,
            {
              maxHeight: heightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0,
                  Dimensions.get('window').height - keyboardVerticalOffset,
                ],
              }),
              zIndex: 10,
            },
          ]}
        >
          {renderMainContainer()}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default BottomModalHandler;
