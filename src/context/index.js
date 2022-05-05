import React from 'react';

// import { getLang } from '../helpers';

export const MainContext = React.createContext();

export class MainContextProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // lang: 'en',
      authToken: null, //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwianRpIjoiNjI0Y2U1NzMtMDJmZC00ODdmLTkwMjAtMDdkOWM2NmVjMzIzIiwiaWF0IjoxNjEzNDk1NDYyLCJuYmYiOjE2MTM0OTU0NjIsImV4cCI6MTYyOTU2NTg2MiwiaXNzIjoiUGlnZW9uTU1DIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MTg2NTgifQ.lR-oULtZbd76Wcptt9eA88RNFX9Ux9J82XJiS2rgLxU',
      isConnected: null,
      users: [],
      firstName: null,
      lastName: null,
      userName: null,
      profileImage: null,
      balance: null,
    };
  }

  render() {
    return (
      <MainContext.Provider
        value={{
          _state: this.state,
          _lang: 'en', //getLang(this.state.lang),
          _setState: (obj) => this.setState(obj),
        }}>
        {this.props.children}
      </MainContext.Provider>
    );
  }
}

//

export const withMainContext = (ChildComponent) => (props) =>
  (
    <MainContext.Consumer>
      {(context) => <ChildComponent {...props} MainContext={context} />}
    </MainContext.Consumer>
  );
