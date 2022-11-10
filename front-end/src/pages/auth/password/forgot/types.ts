import { bindActionCreators, Dispatch } from 'redux';

interface PropsFromDispatch {}

interface PropsFromState {}

export interface Props extends PropsFromDispatch, PropsFromState {}

export class State {
  constructor(emailAddress: string = '') {
    this.emailAddress = emailAddress;
  }
  emailAddress: string;
  emailAddressError: string | undefined = undefined;
  submitted: boolean = false;
  submitting: boolean = false;
}

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);
