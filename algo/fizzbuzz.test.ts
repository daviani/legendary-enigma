import {describe, expect, test} from "bun:test";
import {fizzbuzz} from "./fizzbuzz.ts"


describe("fizzbuzz", () => {
    test("returns Fizz for multiples of 3", () => {
        expect(fizzbuzz(3)).toBe("fizz")
        expect(fizzbuzz(6)).toBe("fizz")
        expect(fizzbuzz(9)).toBe("fizz")
    })
    test("returns Buzz for multiples of 5", () => {
        expect(fizzbuzz(5)).toBe("buzz")
        expect(fizzbuzz(10)).toBe("buzz")
        expect(fizzbuzz(20)).toBe("buzz")
    })
    test("returns FizzBuzz for multiples of 3 and 5", () => {
        expect(fizzbuzz(0)).toBe("fizzbuzz")
        expect(fizzbuzz(15)).toBe("fizzbuzz")
        expect(fizzbuzz(30)).toBe("fizzbuzz")
        expect(fizzbuzz(45)).toBe("fizzbuzz")
    })
    test("returns a numbers in other case", () => {
        expect(fizzbuzz(1)).toBe("1")
        expect(fizzbuzz(2)).toBe("2")
        expect(fizzbuzz(4)).toBe("4")
    })
})