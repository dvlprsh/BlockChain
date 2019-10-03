/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
\.                    return 'DOT'
"("                   return '('
")"                   return ')'
store                 return 'STORE'
transfer              return 'TRANSFER'
0x[0-9a-fA-F]{40}     return 'ADDRESS'
0x[0-9a-fA-F]{0,160}  return 'DATA'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { console.log($1); return $1; }
    ;

e
    : address DOT TRANSFER '(' ')'
        { $$ = '76a9' + $1 + '88ac'; }
    | STORE '(' address ')'
        { var length = ($3.length / 2).toString(16);
          if (length.length % 2 == 1) {
            length = '0' + length;
          }
         $$ = '6a' + length + $3; }
    | STORE '(' data ')'
        { var length = ($3.length / 2).toString(16);
          if (length.length % 2 == 1) {
            length = '0' + length;
          }
         $$ = '6a' + length + $3; }
    ;

address
    : ADDRESS
         { $$ = $1.substring(2); }
    ;

data
    : DATA
         { $$ = $1.substring(2); }
    ;