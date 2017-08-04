import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import { observer } from 'mobx-react';

import styles from './contractDevelop.css';

function Title ({ store }) {
  const { selectedContract } = store;

  if (!selectedContract || !selectedContract.name) {
    return (
      <FormattedMessage
        id='writeContract.title.new'
        defaultMessage='New Solidity Contract'
      />
    );
  }

  return (
    <span>
      { selectedContract.name }
      <span
        className={ styles.timestamp }
        title={
          <FormattedMessage
            id='writeContract.title.saved'
            defaultMessage='saved @ {timestamp}'
            vaules={ {
              timestamp: (new Date(selectedContract.timestamp)).toISOString()
            } }
          />
        }
      >
        <FormattedMessage
          id='writeContract.details.saved'
          defaultMessage='(saved {timestamp})'
          values={ {
            timestamp: moment(selectedContract.timestamp).fromNow()
          } }
        />
      </span>
    </span>
  );
}

Title.propTypes = {
  store: PropTypes.object
};

export default observer(Title);
