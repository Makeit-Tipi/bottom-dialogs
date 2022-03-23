import React from 'react';

import BottomModalHandler, {
  OwnProps as BottomDialogProps,
} from '../BottomModalHandler';

export interface StateProps {}

export interface DispatchProps {}

export type BottomDialogs = {
  [key: string]: BottomDialogProps;
};

export interface OwnProps {
  dialogs: BottomDialogs;
  closeModal: Function;
  iconComponent: any;
}

export type BottomModalsProps = StateProps & DispatchProps & OwnProps;

const BottomModals = (props: BottomModalsProps) => {
  const { dialogs, ...rest } = props;

  if (!dialogs) return false;

  return (
    <>
      {Object.keys(dialogs).map((key) => {
        if (!dialogs[key]) {
          return false;
        }
        return (
          <BottomModalHandler
            {...rest}
            modal={{ ...dialogs[key] }}
            key={key}
            id={key}
          />
        );
      })}
    </>
  );
};

export default BottomModals;
