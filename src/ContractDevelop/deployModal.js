import React from 'react';
import PropTypes from 'prop-types';
import DeployContract from '@parity/dapp-contracts/src/DeployContract';

import { observer } from 'mobx-react';

function DeployModal ({ store, accounts }) {
  const { showDeployModal, contract, sourcecode } = store;

  if (!showDeployModal) {
    return null;
  }

  return (
    <DeployContract
      abi={ contract.interface }
      accounts={ accounts }
      code={ `0x${contract.bytecode}` }
      source={ sourcecode }
      onClose={ store.handleCloseDeployModal }
      readOnly
    />
  );
}

DeployModal.propTypes = {
  store: PropTypes.object
};

export default observer(DeployModal);
