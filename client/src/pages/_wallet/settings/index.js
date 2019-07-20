// Library Imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { selectTheme } from "../../../actions";
import { queryKeys } from "../../../actions";

// Relative Imports
import Page from "../../../components/_layout/page";
import Body from "../../../components/_layout/body";
import Menu from "../../../components/_layout/menu";
import Header from "../../../components/_layout/header";
import Input from "../../../components/_inputs/input";
import Form from "../../../components/_inputs/form";
import Theme from "../../../components/_inputs/theme";
import Footer from "../../../components/_inputs/footer";
import { Container } from "./styles";

import { dark, light } from "../../../constants/themes.js";
import { NO_KEY } from "../../../reducers/keys";

const options = [
  { theme: "dark", value: "Dark Theme" },
  { theme: "light", value: "Light Theme" }
];

class Settings extends Component {
  state = {
    status: false,
    value: "",
    reveal: false,
    validated: true
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({
      value: this.props.theme.value
    });

    if (this.props.privateViewKey.key === NO_KEY) {
      this.props.queryKeys();
    }
  }

  handleClick = ({ theme, value }) => {
    if (theme === "light") {
      this.props.selectTheme(light);
      this.setState({
        value: value
      });
    } else if (theme === "dark") {
      this.props.selectTheme(dark);
      this.setState({
        value: value
      });
    } else {
      return null;
    }
  };

  toggleVisibility = () => {
    this.setState({
      reveal: !this.state.reveal
    });
  };

  render() {
    const { value, reveal } = this.state;
    // const privateKey = "private key";
    const spendKey = "spend key";
    return (
      <Page>
        <Menu />
        <Body>
          <Header
            title="Theme "
            description="Choose between light and dark themes"
          />
          <Form span="true">
            <Theme
              label="Select Theme"
              placeholder="Dark Theme"
              name="value"
              value={value}
              options={options}
              onClick={this.handleClick}
            />
          </Form>

          <Header
            title="Private Keys"
            description="Manage your wallets private keys"
          />
          <Form span="true">
            <Input
              label="Seed Phrase"
              placeholder="Select Asset"
              width="true"
              value={this.props.mnemonicKey.key}
              readOnly
              type={reveal ? "type" : "password"}
              onClick={this.toggleVisibility}
            />
            <Input
              label="Spend Key"
              placeholder="Select Asset"
              width="true"
              value={this.props.spendKey.key}
              readOnly
              type={reveal ? "type" : "password"}
            />
            <Input
              label="View Key"
              placeholder="Select Asset"
              width="true"
              value={this.props.privateViewKey.key}
              readOnly
              type={reveal ? "type" : "password"}
            />
          </Form>
          <Container>
            <Footer
              onClick={this.toggleVisibility}
              label={this.state.reveal ? "Hide Keys" : "Show Keys"}
              validated={this.state.validated}
            />
          </Container>
        </Body>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
  ...state.keys
});

export default connect(
  mapStateToProps,
  { selectTheme, queryKeys }
)(Settings);
