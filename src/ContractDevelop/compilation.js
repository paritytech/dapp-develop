import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Dropdown, Loading } from '@parity/ui';
import Contract from './contract';

import { observer } from 'mobx-react';

import styles from './contractDevelop.css';

function Compilation ({ store }) {
  const { compiled, contracts, compiling, contractIndex, contract } = store;

  if (compiling) {
    return (
      <div className={ styles.centeredMessage }>
        <Loading />
        <p>
          <FormattedMessage
            id='writeContract.compiling.busy'
            defaultMessage='Compiling...'
          />
        </p>
      </div>
    );
  }

  if (!compiled) {
    return (
      <div className={ styles.centeredMessage }>
        <p>
          <FormattedMessage
            id='writeContract.compiling.action'
            defaultMessage='Please compile the source code.'
          />
        </p>
      </div>
    );
  }

  if (!contracts) {
    return <Errors store={ store } />;
  }

  const contractKeys = Object.keys(contracts);

  if (contractKeys.length === 0) {
    return (
      <div className={ styles.centeredMessage }>
        <p>
          <FormattedMessage
            id='writeContract.error.noContract'
            defaultMessage='No contract has been found.'
          />
        </p>
      </div>
    );
  }

  return (
    <div className={ styles.compilation }>
      <Dropdown
        label={
          <FormattedMessage
            id='writeContract.title.contract'
            defaultMessage='Select a contract'
          />
        }
        value={ contractIndex }
        onChange={ store.handleSelectContract }
        options={
          contractKeys.map((name, index) => {
            return {
              key: index,
              value: index,
              text: name
            };
          })
        }
      />
      <Contract contract={ contract } />
      <h4 className={ styles.messagesHeader }>
        <FormattedMessage
          id='writeContract.title.messages'
          defaultMessage='Compiler messages'
        />
      </h4>
      <Errors store={ store } />
    </div>
  );
}

function Errors ({ store }) {
  const { annotations } = store;

  const body = annotations.map((annotation, index) => {
    const { text, row, column, contract, type, formal } = annotation;
    const classType = formal ? 'formal' : type;
    const classes = [ styles.message, styles[classType] ];

    return (
      <div key={ index } className={ styles.messageContainer }>
        <div className={ classes.join(' ') }>{ text }</div>
        <span className={ styles.errorPosition }>
          { contract ? `[ ${contract} ]   ` : '' }
          { row }: { column }
        </span>
      </div>
    );
  });

  return (
    <div className={ styles.errors }>
      { body }
    </div>
  );
}

Compilation.propTypes = {
  store: PropTypes.object
};

Errors.propTypes = {
  store: PropTypes.object
};

export default observer(Compilation);
