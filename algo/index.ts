import {fizzbuzz} from "./fizzbuzz"

const count = parseInt(process.argv[2] || "25")

if (isNaN(count) || count < 1) {
    console.error("Usage: bun run index.ts <number>")
    process.exit(1)
}

for (let i = 1; i <= count; i++) {
    console.log(fizzbuzz(i))
}