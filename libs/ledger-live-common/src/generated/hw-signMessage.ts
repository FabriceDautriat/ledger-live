import bitcoin from "../families/bitcoin/hw-signMessage";
import casper from "../families/casper/hw-signMessage";
import filecoin from "../families/filecoin/hw-signMessage";
import internet_computer from "../families/internet_computer/hw-signMessage";
import stacks from "../families/stacks/hw-signMessage";
import { messageSigner as evm } from "../families/evm/setup";

export default {
  bitcoin,
  casper,
  filecoin,
  internet_computer,
  stacks,
  evm,
};
