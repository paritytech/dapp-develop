import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Input } from '@parity/ui';

import { observer } from 'mobx-react';

function Contract ({ contract }) {
  if (!contract) {
    return null;
  }

  const { bytecode } = contract;
  const abi = contract.interface;

  const metadata = contract.metadata
    ? (
      <Input
        allowCopy
        label={
          <FormattedMessage
            id='writeContract.input.metadata'
            defaultMessage='Metadata'
          />
        }
        readOnly
        value={ contract.metadata }
      />
    )
    : null;

  return (
    <div>
      <Input
        allowCopy
        label={
          <FormattedMessage
            id='writeContract.input.abi'
            defaultMessage='ABI Definition'
          />
        }
        readOnly
        value={ abi }
      />

      <Input
        allowCopy
        label={
          <FormattedMessage
            id='writeContract.input.code'
            defaultMessage='Bytecode'
          />
        }
        readOnly
        value={ `0x${bytecode}` }
      />

      { metadata }
      <SwarmHash contract={ contract } />
    </div>
  );
}

function SwarmHash ({ contract }) {
  if (!contract || !contract.metadata) {
    return null;
  }

  const { bytecode } = contract;

  // @see https://solidity.readthedocs.io/en/develop/miscellaneous.html#encoding-of-the-metadata-hash-in-the-bytecode
  const hashRegex = /a165627a7a72305820([a-f0-9]{64})0029$/;

  if (!hashRegex.test(bytecode)) {
    return null;
  }

  const hash = hashRegex.exec(bytecode)[1];

  return (
    <Input
      allowCopy
      label={
        <FormattedMessage
          id='writeContract.input.swarm'
          defaultMessage='Swarm Metadata Hash'
        />
      }
      readOnly
      value={ `${hash}` }
    />
  );
}

Contract.propTypes = {
  contract: PropTypes.object
};

SwarmHash.propTypes = {
  contract: PropTypes.object
};

export default observer(Contract);
