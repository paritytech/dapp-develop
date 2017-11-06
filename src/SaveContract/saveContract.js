// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ERRORS, validateName } from '@parity/shared/lib/util/validation';
import { Button, Form, Input, Portal } from '@parity/ui';
import Editor from '@parity/ui/lib/Editor';
import { CancelIcon, SaveIcon } from '@parity/ui/lib/Icons';

import styles from './saveContract.css';

export default class SaveContract extends Component {
  static propTypes = {
    sourcecode: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  state = {
    name: '',
    nameError: ERRORS.invalidName
  };

  render () {
    const { sourcecode } = this.props;
    const { name, nameError } = this.state;

    return (
      <Portal
        buttons={ this.renderDialogActions() }
        onClose={ this.onClose }
        open
        title={
          <FormattedMessage
            id='saveContract.title'
            defaultMessage='save contract'
          />
        }
      >
        <div>
          <Form>
            <Input
              label={
                <FormattedMessage
                  id='saveContract.name.label'
                  defaultMessage='contract name'
                />
              }
              hint={
                <FormattedMessage
                  id='saveContract.name.hint'
                  defaultMessage='choose a name for this contract'
                />
              }
              value={ name }
              error={ nameError }
              onChange={ this.onChangeName }
            />
          </Form>
          <Editor
            className={ styles.source }
            value={ sourcecode }
            maxLines={ 25 }
            readOnly
          />
        </div>
      </Portal>
    );
  }

  renderDialogActions () {
    const cancelBtn = (
      <Button
        icon={ <CancelIcon /> }
        key='cancel'
        label={
          <FormattedMessage
            id='saveContract.buttons.cancel'
            defaultMessage='Cancel'
          />
        }
        onClick={ this.onClose }
      />
    );

    const confirmBtn = (
      <Button
        icon={ <SaveIcon /> }
        key='save'
        label={
          <FormattedMessage
            id='saveContract.buttons.save'
            defaultMessage='Save'
          />
        }
        disabled={ !!this.state.nameError }
        onClick={ this.onSave }
      />
    );

    return [ cancelBtn, confirmBtn ];
  }

  onClose = () => {
    this.props.onClose();
  }

  onSave = () => {
    const { name } = this.state;
    const { sourcecode } = this.props;

    this.props.onSave({ name, sourcecode });
    this.onClose();
  }

  onChangeName = (event, value) => {
    const { name, nameError } = validateName(value);

    this.setState({ name, nameError });
  }
}
