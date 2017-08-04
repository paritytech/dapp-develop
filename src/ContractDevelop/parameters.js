import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Dropdown, Loading, Toggle } from '@parity/ui';
import { SendIcon, SettingsIcon } from '@parity/ui/Icons';
import Compilation from './compilation';

import { observer } from 'mobx-react';

import styles from './contractDevelop.css';

function Parameters ({ store }) {
  const { compiling, contract, selectedBuild, loading, workerError } = store;

  if (selectedBuild < 0) {
    return (
      <div className={ `${styles.panel} ${styles.centeredMessage}` }>
        <Loading />
        <p>
          <FormattedMessage
            id='writeContract.title.loading'
            defaultMessage='Loading...'
          />
        </p>
      </div>
    );
  }

  let content;

  if (workerError) {
    content = (
      <div className={ styles.panel }>
        <div className={ styles.centeredMessage }>
          <p>
            <FormattedMessage
              id='writeContract.error.params'
              defaultMessage='An error occurred with the following description'
            />
          </p>
          <div className={ styles.error }>
            { workerError.toString() }
          </div>
        </div>
      </div>
    );
  } else if (loading) {
    const { longVersion } = store.builds[selectedBuild];

    content = (
      <div className={ styles.panel }>
        <div className={ styles.centeredMessage }>
          <Loading />
          <p>
            <FormattedMessage
              id='writeContract.title.solidity'
              defaultMessage='Loading Solidity {version}'
              values={ {
                version: longVersion
              } }
            />
          </p>
        </div>
      </div>
    );
  } else {
    content = <Compilation store={ store } />;
  }

  return (
    <div className={ styles.panel }>
      <div>
        <Button
          icon={ <SettingsIcon /> }
          label={
            <FormattedMessage
              id='writeContract.buttons.compile'
              defaultMessage='Compile'
            />
          }
          onClick={ store.handleCompile }
          primary={ false }
          disabled={ compiling || store.isPristine }
        />
        {
          contract
            ? (
              <span>
                <Button
                  disabled={ compiling || !store.isPristine }
                  icon={ <SendIcon /> }
                  label={
                    <FormattedMessage
                      id='writeContract.buttons.deploy'
                      defaultMessage='Deploy'
                    />
                  }
                  onClick={ store.handleOpenDeployModal }
                  primary={ false }
                />
              </span>
          )
          : null
        }

      </div>
      <div className={ styles.toggles }>
        <div>
          <Toggle
            label={
              <FormattedMessage
                id='writeContract.buttons.optimise'
                defaultMessage='Optimise'
              />
            }
            labelPosition='right'
            onToggle={ store.handleOptimizeToggle }
            toggled={ store.optimize }
          />
        </div>
        <div>
          <Toggle
            label={
              <FormattedMessage
                id='writeContract.buttons.autoCompile'
                defaultMessage='Auto-Compile'
              />
            }
            labelPosition='right'
            onToggle={ store.handleAutocompileToggle }
            toggled={ store.autocompile }
          />
        </div>
      </div>
      <SolidityVersions store={ store } />
      { content }
    </div>
  );
}

function SolidityVersions ({ store }) {
  const { builds, selectedBuild } = store;

  return (
    <div>
      <Dropdown
        label={
          <FormattedMessage
            id='writeContract.title.selectSolidity'
            defaultMessage='Select a Solidity version'
          />
        }
        value={ selectedBuild }
        onChange={ store.handleSelectBuild }
        options={
          builds.map((build, index) => {
            return {
              key: index,
              text: build.release ? build.version : build.longVersion,
              value: index,
              content:
                build.release
                  ? (
                    <span className={ styles.big }>
                      { build.version }
                    </span>
                  )
                  : build.longVersion
            };
          })
        }
      />
    </div>
  );
}

SolidityVersions.propTypes = {
  store: PropTypes.object
};

Parameters.propTypes = {
  store: PropTypes.object
};

export default observer(Parameters);
