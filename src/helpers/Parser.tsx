
import { Optional, isDigit } from "./general";
import { List } from "immutable";


export type ParserResult<Result> = { result: Result, leftover: string }


export default class Parser<Result>{

    constructor(
        private readonly parser: (input: string) => Optional<ParserResult<Result>>,
    ) { }

    parse(input: string) {
        return this.parser(input);
    }

    many(maxLength?: number): Parser<List<Result>> {
        return new Parser(input => {

            let leftover = input;
            const arrayToReturn: Result[] = [];
            // eslint-disable-next-line no-constant-condition
            while (leftover.length >= 1 && arrayToReturn.length < (maxLength ?? Number.MAX_VALUE)) {
                const next = this.parse(leftover);
                if (next == null) break;
                leftover = next.leftover;
                arrayToReturn.push(next.result);
            }
            if (arrayToReturn.length <= 0) { return null; }
            return { result: List(arrayToReturn), leftover };
        });
    }

    map<NewResult>(transform: (result: Result) => NewResult){
        return new Parser(input => {
            const parsed = this.parse(input);
            if (parsed == null){return null;}
            return {result: transform(parsed.result), leftover: parsed.leftover};
        });
    }

    then<NextResult>(nextParser: Parser<NextResult>, optional = false): Parser<[Result, Optional<NextResult>]>{
        return new Parser(input => {
            const firstResult = this.parse(input);
            if (firstResult == null){return null;}
            const secondResult = nextParser.parse(firstResult.leftover);
            if (secondResult == null && optional === false){return null;}
            return {result: [firstResult.result, secondResult?.result ?? null], leftover: secondResult?.leftover ?? firstResult.leftover};
        });
    }

    ignoreNulls(){
        return new Parser(input => {
            let _input = input;
            let result: Optional<ParserResult<Result>> = null;

            while (result == null && _input.length > 0){
                result = this.parse(_input);
                if (result == null) _input = _input.substr(1);
            }
            return result;
        });
    }


    static character(predicate: (character: string) => boolean) {
        return new Parser(input => {
            const first = input[0];
            if (predicate(first)) {
                return {
                    result: first,
                    leftover: input.substring(1),
                }
            } else { return null; }
        });
    }

    
}

export const CustomParsers = {

    digit: Parser.character(char => isDigit(char)),

}



