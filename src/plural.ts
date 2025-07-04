export const pluralRules = new Intl.PluralRules('pl-PL');

export const groupPlural: Record<Intl.LDMLPluralRule, string> = {
  zero: 'grup',
  one: 'grupa',
  two: 'grupy',
  few: 'grupy',
  many: 'grup',
  other: 'grupy',
};
