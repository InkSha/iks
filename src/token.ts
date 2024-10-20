export const TokenConfig = {
  Controller: "__Controller__",
  Router: "__Router__",
  RouterMethod: "__Router_Method__",
  Moudle: "__Module__",
  Params: "__Params__",
  Injectable: "__INJECTABLE__"
} as const satisfies Record<string, `__${string}__`>
