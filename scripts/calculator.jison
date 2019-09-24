/* lexical grammar */
%lex
%%
\s+ /* skip whitespace */
[0-9]+("."[0-9]+)?\b return 'NUMBER'
"-" return '-'
"+" return '+'
"*" return '*'
"/" return '/'
<<EOF>> return 'EOF'
. return 'INVALID'
/lex
%left '+' '-'
%left '*' '/'
%start expressions
%% /* language grammar */
expressions
 : e EOF
 { console.log($1); }
 ;
e
 : e '+' e
 {$$ = $1+$3;}
 | e '-' e
 {$$ = $1-$3;}
 | e '*' e
 {$$ = $1*$3;}
 | e '/' e
 {$$ = $1/$3;}
 | NUMBER
 {$$ = Number(yytext);}
 ;