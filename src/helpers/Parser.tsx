
import { Optional, isDigit } from "./general";
import { List } from "immutable";


type ParserResult<Result> = { result: Result, leftover: string }


export default class Parser<Result>{

    constructor(
        private readonly parser: (input: string) => Optional<ParserResult<Result>>,
    ) { }

    parse(input: string) {
        return this.parser(input);
    }

    many(): Parser<List<Result>> {
        return new Parser(input => {
            let leftover = input;
            const arrayToReturn: Result[] = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                let newNext = this.parse(leftover);
                if (newNext == null) { break; }
                arrayToReturn.push(newNext.result);
                leftover = newNext.leftover;
            }
            if (arrayToReturn.length <= 1) { return null; }
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

    then<NextResult>(nextParser: Parser<[Result, NextResult]>){
        return new Parser(input => {
            const firstResult = this.parse(input);
            if (firstResult == null){return null;}
            const secondResult = nextParser.parse(firstResult.leftover);
            if (secondResult == null){return null;}
            return {result: [firstResult.result, secondResult.result], leftover: secondResult.leftover};
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



