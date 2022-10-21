import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import { SignInPrompt, SignOutButton } from './ui-components';


export default function App({ isSignedIn, PatientNEAR, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  // Get blockchian state once on component load
  React.useEffect(() => {
    PatientNEAR.getPatient()
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }, []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt patient={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  }

  function changePatient(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    const { patientInput } = e.target.elements;
    PatientNEAR.setPatient(patientInput.value)
      .then(async () => {return PatientNEAR.getPatient();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>Patient info</h1>
        <p>
          Name: <span className="patient">{valueFromBlockchain?.name}</span>
        </p>
        <p>
          Age: <span className="patient">{valueFromBlockchain?.age}</span>
        </p>
        <p>
          Email: <span className="patient">{valueFromBlockchain?.email}</span>
        </p>
        <p>
          Description: <span className="patient">{valueFromBlockchain?.description}</span>
        </p>
        <form onSubmit={changePatient} className="change">
          <label>Change patient info:</label>
          <div>
            <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain?.name}
              id="patientInputName"
              placeholder='Name'
            />
            </div>
            <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain?.age}
              id="patientInputAge"
              placeholder='Age'
            />
            </div>
            <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain?.email}
              id="patientInputEmail"
              placeholder='Email'
            />
            </div>
            <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain?.description}
              id="patientInputDescription"
              placeholder='Description'
            />
            </div>
            <button>
              <span>Save</span>
              <div className="loader"></div>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
