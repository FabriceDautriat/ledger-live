import fs from "fs";
import "./live-common-set-supported-currencies";
import {
  listCryptoCurrencies,
  isCurrencySupported,
  listTokens,
} from "@ledgerhq/live-common/currencies/index";

const outputFile = "cryptoassets.md";

function gen() {
  const currencies = listCryptoCurrencies();

  let md = "# Supported crypto assets\n\n";
  md += "## Crypto currencies (" + currencies.length + ")\n";
  md += "| name | ticker | supported on Ledger Live? | ledger id |\n";
  md += "|--|--|--|--|\n";

  currencies
    .slice(0)
    .sort((a, b) => {
      if (isCurrencySupported(a) === isCurrencySupported(b)) {
        return a.name < b.name ? -1 : 1;
      }
      return isCurrencySupported(b) ? 1 : -1;
    })
    .forEach(currency => {
      md += `| ${currency.name} | ${currency.ticker} | ${
        isCurrencySupported(currency) ? "YES" : "NO"
      } | ${currency.id} |\n`;
    });

  md += "\n";

  const tokens = listTokens({
    withDelisted: true,
  });

  md += "## Tokens (" + tokens.length + ")\n";
  md += "| parent currency | ticker | contract | name | status | ledger id |\n";
  md += "|--|--|--|--|--|--|\n";

  tokens
    .slice(0)
    .sort((a, b) => {
      if (a.parentCurrency === b.parentCurrency) {
        return a.name < b.name ? -1 : 1;
      }
      return a.parentCurrency.name > b.parentCurrency.name ? 1 : -1;
    })
    .forEach(token => {
      const status = [];
      if (token.delisted) {
        status.push("delisted");
      }
      md += `| ${token.parentCurrency.name} | ${token.ticker} | ${token.contractAddress || ""} | ${
        token.name
      } | ${status.join(", ")} | ${token.id} |\n`;
    });

  md += "\n";

  return md;
}

const md = gen();
fs.writeFileSync(outputFile, md);
