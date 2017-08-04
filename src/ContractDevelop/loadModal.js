import React from 'react';
import PropTypes from 'prop-types';
import LoadContract from '../LoadContract';

import { observer } from 'mobx-react';

function LoadModal ({ store }) {
  const { showLoadModal } = store;

  if (!showLoadModal) {
    return null;
  }

  return (
    <LoadContract
      onLoad={ store.handleLoadContract }
      onDelete={ store.handleDeleteContract }
      onClose={ store.handleCloseLoadModal }
      contracts={ store.savedContracts }
      snippets={ store.snippets }
    />
  );
}

LoadModal.propTypes = {
  store: PropTypes.object
};

export default observer(LoadModal);
