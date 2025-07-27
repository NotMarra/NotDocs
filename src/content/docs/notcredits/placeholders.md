---
title: "Placeholders"
autor: "NotMarra"
---

- %notcredits_credits% - Shows how much credit the player has. (since v3.0 shows only raw rounded number)
- %notcredits_credits_formatted% - (since v3.0) Shows formatted balance of player
- %notcredits_top\_#% - Returns the highest number of credits in the database
- %notcredits_top_name\_#% - Returns the name of the player with the most credits

:::tip

Examples how formatted placeholder works based on config:

balance_decimal: false, balance_short: false<br />
1234.56 → "1235"

balance_decimal: false, balance_short: true<br />
1234.56 → "1.23k"

balance_decimal: true, balance_short: false balance_format: '#.##'<br />
1234.56 → "1234.56"

balance_decimal: true, balance_short: true balance_format: '#.##'<br />
1234.56 → "1.23k"
:::
