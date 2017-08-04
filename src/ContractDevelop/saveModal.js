import React from 'react';
import PropTypes from 'prop-types';
import SaveContract from '../SaveContract';

import { observer } from 'mobx-react';

function SaveModal ({ store }) {
  const { showSaveModal, sourcecode } = store;

  if (!showSaveModal) {
    return null;
  }

  return (
    <SaveContract
      sourcecode={ sourcecode }
      onSave={ store.handleSaveNewContract }
      onClose={ store.handleCloseSaveModal }
    />
  );
}

SaveModal.propTypes = {
  store: PropTypes.object
};

export default observer(SaveModal);
