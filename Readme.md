# Finding the minimal set of serial numbers with a given set of features

My cousin recently came to me with a data problem. He had a load of radio serial numbers, all with a different set of features. Given a set of required features, he wanted to be able to quickly find the smallest possible set of radio serial numbers that would, between them, have all of those required features.

The data was stored in a huge table in Google Sheets, with rows representing features, columns representing serial numbers, and 1s or 0s used to represent whether a given serial number had a given feature.

It turns out that Google Sheets lets you define your own custom spreadsheet functions using javascript, which is really nice, so I had a go at creating a custom function that would do this task. The javascript code is contained in this repo. The custom function to be called in the spreadsheet is findMinimalSerials, which takes the big feature table as its first input (including row/column labels), and the list of required features as its second input.

The rest of this readme explains some different possible approaches to the problem, before describing the one actually taken.

## Possible approaches to the problem

### Brute force

With N serial numbers, there are 2^N possible serial number combinations (each of the N serial numbers could either be included or not included).

One way to solve the problem would be to iterate through all 2^N combinations, check whether each one is valid (i.e. contains all of the required features), and remember the smallest valid combination that we have seen so far. At the end, we'll know what the smallest set is.

The problem is that 2^N becomes very big very quickly. This approach will take a very long time, even for a modest number of serial numbers.

### Traverse only the valid combinations

My first attempt was to try to iterate through the combinations in a way that meant we would only ever need to check the *valid* combinations. After we have traversed all the valid combinations, then at the end, we will know which one is the smallest.

The idea is that we start by including every single serial number (guaranteed to be a valid combination if a solution exists). We then start removing them, in different combinations. But we only ever remove a serial number that is not *essential* (i.e. it is the only remaining serial number containing one of the required features). This way we automatically cut off all of the parts of the 2^N solution space that are invalid.

This approach is faster than pure brute force, but the set of valid solutions can still be very large, and it was still becoming prohibitively slow for big tables.

### The solution I settled on: Start with the smallest combinations first

This approach is essentially the opposite of the previous one. Instead of starting with all serial numbers included and gradually removing them, we start with *no* serial numbers at all (guaranteed to be invalid), and then start adding them, until we get the required features.

That is, we try all the single serial numbers on their own first, then all combinations with a pair of serial numbers, then all combinations of three serial numbers, and so on.

The massive advantage of this approach is that as soon as we find a valid solution, we can immediately stop. There is guaranteed to be no smaller valid solution, or we would have found it already.

The other significant performance boost we can get here, is that we only need to bother adding a serial number if it contains a required feature that we don't already have. This again will usually let us significantly cut down on the full 2^N solution space, without needing to check all of it.

This approach doesn't beat the previous one in every situation. For example, suppose that the only valid solution is the one containing *all* of the serial numbers. The previous approach would immediately identify that all serial numbers were essential, and stop. On the other hand, this approach in this example *would* have to check all 2^N combinations before it discovered the answer, so could take an extremely long time.

However, in our particular context, the typical case is that a solution exists with a very small number of serial numbers, which makes this approach far superior. It should find the optimum solution very quickly.