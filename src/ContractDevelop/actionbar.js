import React from 'react';
import PropTypes from 'prop-types';
import { Actionbar as ActionbarUI, ActionbarExport, ActionbarImport, Button } from '@parity/ui';
import { FormattedMessage } from 'react-intl';
import { CancelIcon, ListIcon, SaveIcon } from '@parity/ui/Icons';
import Editor from '@parity/ui/Editor';
import { observer } from 'mobx-react';

function Actionbar ({ store }) {
  const { sourcecode, selectedContract } = store;

  const filename = selectedContract && selectedContract.name
    ? selectedContract.name
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/-$/, '')
      .toLowerCase()
    : 'contract.sol';

  const extension = /\.sol$/.test(filename) ? '' : '.sol';

  const buttons = [
    <Button
      icon={ <CancelIcon /> }
      label={
        <FormattedMessage
          id='writeContract.buttons.new'
          defaultMessage='New'
        />
      }
      key='newContract'
      onClick={ store.handleNewContract }
    />,
    <Button
      icon={ <ListIcon /> }
      label={
        <FormattedMessage
          id='writeContract.buttons.load'
          defaultMessage='Load'
        />
      }
      key='loadContract'
      onClick={ store.handleOpenLoadModal }
    />,
    <Button
      icon={ <SaveIcon /> }
      label={
        <FormattedMessage
          id='writeContract.buttons.save'
          defaultMessage='Save'
        />
      }
      key='saveContract'
      onClick={ store.handleSaveContract }
    />,
    <ActionbarExport
      key='exportSourcecode'
      content={ sourcecode }
      filename={ `${filename}${extension}` }
    />,
    <ActionbarImport
      key='importSourcecode'
      title={
        <FormattedMessage
          id='writeContract.buttons.import'
          defaultMessage='Import Solidity'
        />
      }
      onConfirm={ store.handleImport }
      renderValidation={ renderImportValidation }
    />
  ];

  return (
    <ActionbarUI
      title={
        <FormattedMessage
          id='writeContract.title.main'
          defaultMessage='Write a Contract'
        />
      }
      buttons={ buttons }
    />
  );
}

function renderImportValidation (content) {
  return (
    <Editor
      readOnly
      value={ content }
      maxLines={ 20 }
    />
  );
}

Actionbar.propTypes = {
  store: PropTypes.object
};

export default observer(Actionbar);
