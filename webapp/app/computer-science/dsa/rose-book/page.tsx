"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   THE DSA CODEX — A Digital Simulation Book
   Rose + White Magazine-Style Futuristic Textbook
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── THEME ──────────────────────────────────────────────────────────────────
const T = {
    rose: "#9E2B4A",
    roseLight: "#C75B7A",
    rosePale: "#F2DCE2",
    roseMist: "#FBF2F5",
    roseDark: "#6B1D34",
    white: "#FFFFFF",
    offWhite: "#FAFAFA",
    bg: "#FCFCFC",
    text: "#1A1A2E",
    textMuted: "#6B6B80",
    textLight: "#9999AB",
    border: "#EDEBF0",
    accent: "#2B2B40",
    green: "#2D7A5F",
    orange: "#D4773B",
    blue: "#3B6BC7",
};

// ─── FONTS ──────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

// ─── TIMELINE DATA ──────────────────────────────────────────────────────────
const TIMELINE = [
    { year: "~300 BC", title: "Euclid's Algorithm", who: "Euclid of Alexandria", problem: "Finding the greatest common divisor of two numbers was needed for simplifying fractions and land measurement in ancient Greece. Euclid wrote a step-by-step procedure — the earliest known algorithm — in his book 'Elements'.", impact: "Established the very concept that a problem can be solved by a finite sequence of precise steps. Every algorithm ever written descends from this idea." },
    { year: "1843", title: "First Computer Program", who: "Ada Lovelace", problem: "Charles Babbage designed the Analytical Engine, a mechanical computer, but nobody had written instructions for it. Ada Lovelace wrote an algorithm to compute Bernoulli numbers — the world's first computer program.", impact: "Proved that machines could be instructed to solve problems beyond simple arithmetic. The very concept of 'programming' was born." },
    { year: "1936", title: "Turing Machine", who: "Alan Turing", problem: "Mathematicians debated: 'Are there problems that NO procedure can solve?' Turing invented an abstract machine to formalize what 'computation' means — a tape, a head that reads/writes, and a set of rules.", impact: "Defined the theoretical limits of computation. Every computer, every phone, every server is a physical realization of Turing's abstract machine." },
    { year: "1945", title: "Merge Sort & Arrays", who: "John von Neumann", problem: "Early computers stored data in sequential memory. Von Neumann needed to sort data for the EDVAC computer and invented merge sort — the first O(n log n) sorting algorithm. Arrays became the natural way to store sequences.", impact: "Arrays became the foundation of all data structures. Merge sort proved that sorting could be done far faster than the naive O(n²) approaches." },
    { year: "1953", title: "Hash Table", who: "Hans Peter Luhn (IBM)", problem: "IBM was processing massive datasets — census records, chemical compound databases. Looking up one record among millions by scanning every entry (linear search) was painfully slow. Luhn invented a way to compute a record's location directly from its key.", impact: "Unlocked O(1) average-case lookup. Today, every Python dict, every database index, every DNS query, and every cache depends on hash tables." },
    { year: "1956", title: "Linked Lists", who: "Newell, Shaw & Simon", problem: "At RAND Corporation, researchers building AI programs needed a data structure that could grow and shrink dynamically. Arrays were fixed-size and inserting in the middle shifted everything. They invented nodes connected by pointers.", impact: "Enabled dynamic data structures. Led to stacks, queues, deques, and became the foundation for memory management (free lists) in operating systems." },
    { year: "1956", title: "Dijkstra's Algorithm", who: "Edsger Dijkstra", problem: "The Dutch computing pioneer was designing a system to demonstrate a new computer (ARMAC). He needed to find the shortest route between two cities in the Netherlands. In 20 minutes at a café, he invented the algorithm — without pencil and paper.", impact: "Made GPS navigation possible. Every time Google Maps finds you a route, Dijkstra's algorithm (or a descendant like A*) is running behind the scenes." },
    { year: "1960", title: "Stacks & Queues", who: "Bauer, Samelson & others", problem: "Computers needed to evaluate mathematical expressions like (3+4)×(5-2) and track nested function calls. Stacks (LIFO) and queues (FIFO) were formalized as abstract data types to solve these problems.", impact: "Every programming language uses a call stack. Every BFS uses a queue. Every undo button uses a stack. These simple structures power all of modern computing." },
    { year: "1962", title: "Binary Search Trees & AVL Trees", who: "Adelson-Velsky & Landis", problem: "Binary search trees could degenerate into linked lists if data was inserted in order (1, 2, 3, 4...), making all operations O(n). AVL trees automatically rebalanced after each insertion to guarantee O(log n).", impact: "Self-balancing trees became the foundation for database indexes, file systems, and language standard libraries (C++ std::map, Java TreeMap)." },
    { year: "1962", title: "Quicksort", who: "Tony Hoare", problem: "Merge sort required O(n) extra memory — a serious limitation when RAM was tiny and expensive. Hoare invented quicksort, which sorts in-place using only O(log n) stack space. He was 26 years old.", impact: "Became the most widely used sorting algorithm in practice. Most language standard library sorts are based on quicksort or its hybrid descendants." },
    { year: "1970", title: "B-Trees", who: "Bayer & McCreight (Boeing)", problem: "Databases stored data on magnetic disks, where each 'seek' to a different location took milliseconds — an eternity for a computer. Binary trees required too many disk seeks (one per level). B-trees are wider and shallower, minimizing disk reads.", impact: "Made databases fast. Every modern database (PostgreSQL, MySQL, SQLite) uses B-trees or B+ trees for indexing. Your phone's file system uses them." },
    { year: "1970s", title: "Big O Notation Popularized", who: "Donald Knuth", problem: "Computer scientists needed a standardized way to discuss algorithm efficiency. Big O notation existed in mathematics since 1894 (Paul Bachman), but Knuth popularized it for algorithm analysis in his monumental series 'The Art of Computer Programming'.", impact: "Gave the entire field a common language for comparing algorithms. When someone says 'that's O(n log n)', every computer scientist worldwide understands." },
    { year: "1972", title: "Red-Black Trees", who: "Rudolf Bayer", problem: "AVL trees maintained strict balance (height difference ≤ 1), which required many rotations during insertions. Red-black trees relaxed the balance constraint, requiring fewer rotations while still guaranteeing O(log n).", impact: "Used inside Linux kernel, Java's HashMap (for long chains), C++ std::map. The most widely deployed self-balancing tree in production systems." },
    { year: "1984", title: "Dynamic Programming Formalized", who: "Richard Bellman (coined 1950s)", problem: "Optimization problems — shortest paths, resource allocation, sequence alignment — required exploring exponentially many possibilities. Bellman's technique of storing and reusing sub-solutions turned exponential problems into polynomial ones.", impact: "Made GPS routing, DNA sequence alignment, speech recognition, and spell-checking computationally feasible. Without DP, bioinformatics wouldn't exist." },
];

// ─── DS CHAPTER DATA (rich, beginner-friendly) ────────────────────────────
const CHAPTERS = [
    {
        id: "array", name: "Array", icon: "▦",
        subtitle: "The Foundation of Everything",
        heroColor: T.rose,
        intro: "Imagine you have a shelf with exactly 10 numbered slots — slot 0, slot 1, slot 2, all the way to slot 9. Each slot can hold one item. You can instantly grab the item in slot 7 without looking at slots 0 through 6. That's an array — a sequence of boxes, side by side in memory, each with a number.",
        whyCreated: "In the 1940s-50s, the first computers stored data in sequential memory — one byte after another, like houses on a street. Arrays were the most natural way to organize data because they directly mapped to how physical memory worked. FORTRAN (1957) was the first programming language to give arrays a proper name and syntax.",
        painBefore: "Before arrays existed, if you wanted to store 100 student grades, you needed 100 individual variables: grade_1, grade_2, grade_3... all the way to grade_100. Want to find the average? You'd have to type out (grade_1 + grade_2 + grade_3 + ... + grade_100) / 100. You literally couldn't write a loop because there was no way to say 'give me the i-th grade.' It was like having a library where every book had a unique name but no shelf system — you'd have to remember exactly where you put each one.",
        whatBreaks: "Remove arrays and essentially ALL of computing stops. Your computer screen? It's an array of pixels. A photo? A 2D array of color values. A song? An array of audio samples. Text? An array of characters. Python's lists, JavaScript's arrays, even the internal memory of your computer — all arrays. Hash tables, heaps, strings, DP tables — all built on top of arrays. Without arrays, there is no modern computing.",
        howItWorks: "An array stores elements in contiguous (side-by-side) memory locations. If element 0 starts at memory address 1000 and each element takes 8 bytes, then element 5 is at address 1000 + (5 × 8) = 1040. The computer doesn't need to search — it just does simple arithmetic to find any element instantly. This is called O(1) random access.\n\nThe tradeoff: because elements are packed together, inserting a new element in the middle means pushing everything after it one position to the right — like squeezing into a crowded bench, forcing everyone to scoot over. That's O(n), and it's the price you pay for that instant access.",
        realWorld: [
            { name: "Your Screen", desc: "Every pixel on your monitor is stored in a 2D array called a framebuffer. A 1920×1080 screen = an array of 2,073,600 pixel values, updated 60+ times per second." },
            { name: "Spotify Audio", desc: "When you play a song, the audio is an array of amplitude samples — typically 44,100 numbers per second. Your speaker converts these numbers back into sound waves." },
            { name: "Excel Spreadsheet", desc: "A spreadsheet is a 2D array. Cell B3 is really array[2][1] (row 2, column 1). When you type a formula, the software reads and writes array positions." },
            { name: "Machine Learning", desc: "Neural networks process arrays of numbers (tensors). An image fed to an AI is a 3D array: height × width × color channels. NumPy arrays are the backbone of all ML in Python." },
        ],
        ops: [
            { op: "Read element by index", time: "O(1)", desc: "Instant — just calculate the address", verdict: "✦" },
            { op: "Search for a value", time: "O(n)", desc: "Must check each element one by one", verdict: "✧" },
            { op: "Add to the end", time: "O(1)", desc: "Just place it in the next slot (amortized)", verdict: "✦" },
            { op: "Insert in the middle", time: "O(n)", desc: "Everything after it shifts right", verdict: "✧" },
            { op: "Delete from the middle", time: "O(n)", desc: "Everything after it shifts left", verdict: "✧" },
            { op: "Sort", time: "O(n log n)", desc: "Python uses TimSort, a fast hybrid algorithm", verdict: "◈" },
        ],
        simData: { type: "array", initial: [42, 17, 89, 3, 56, 71, 23] },
    },
    {
        id: "hashTable", name: "Hash Table", icon: "🗄",
        subtitle: "The Speed Machine",
        heroColor: T.roseDark,
        intro: "Imagine a magical filing cabinet. You tell it the name of a person, and it instantly opens the exact drawer containing their file — without searching through any other drawers. No matter if you have 10 files or 10 million files, it takes the same amount of time. That's a hash table.",
        whyCreated: "In 1953, Hans Peter Luhn at IBM faced a problem: databases were getting huge. The company was processing census data, insurance records, and chemical compound databases with millions of entries. Searching through every record one by one (linear search) was far too slow. Luhn realized that if you could mathematically calculate WHERE a record should be stored based on its key, you could skip the search entirely.",
        painBefore: "Picture a massive warehouse with 1 million boxes of files, but no labeling system. Someone asks you: 'Find the file for John Smith.' With an unsorted collection, you'd have to open boxes one by one — on average, checking 500,000 boxes before finding it. Even with a sorted system and binary search, you'd need about 20 steps (log₂ of 1,000,000). But with a hash table: you compute hash('John Smith'), which might give you box #47,392, and you go directly there. One step. Every time.",
        whatBreaks: "Hash tables are so deeply woven into computing that removing them would be like removing electricity from a city. Python would become roughly 100× slower — every time you access a variable, Python internally does a dictionary lookup. The internet would collapse: DNS (the system that converts 'google.com' into an IP address) uses hash tables. Every database, every cache (Redis, Memcached), every web session, every compiler's symbol table — gone. Your browser cookies, password storage, spam filters — all rely on hashing.",
        howItWorks: "A hash table has two parts: an array of 'buckets' and a hash function. The hash function takes any key (like a string 'Alice') and converts it into a number (like 3). That number becomes the index in the array where we store Alice's data.\n\nThe magic: this conversion always gives the same result for the same input (hash('Alice') is always 3), and it's incredibly fast — just a few CPU operations.\n\nThe problem: sometimes two different keys produce the same number. This is called a 'collision' — like two people assigned the same locker. There are clever ways to handle this (chaining: make each bucket a mini-list, or probing: look at the next empty bucket), but collisions are why the worst case is O(n) even though the average case is O(1).",
        realWorld: [
            { name: "Every Python Variable", desc: "When you write x = 5, Python stores this in an internal dictionary (hash table). When you later read x, it does a hash table lookup to find the value. This happens thousands of times per second in any Python program." },
            { name: "Website Logins", desc: "When you create a password, the server doesn't store it directly. Instead, it stores hash(password). When you log in, it hashes what you typed and compares. Even if hackers steal the database, they can't reverse the hashes to get your password." },
            { name: "Google Search Caching", desc: "When millions of people search for 'weather today,' Google doesn't re-compute the result each time. It stores {query → result} in a hash table cache. Same query = instant result from cache." },
            { name: "Spell Checkers", desc: "Your phone's autocorrect loads a dictionary of valid words into a hash set. For every word you type, it checks: is_valid = word in dictionary. This O(1) check happens after every keystroke." },
        ],
        ops: [
            { op: "Look up by key", time: "O(1) avg", desc: "Compute hash, go directly to that slot", verdict: "✦" },
            { op: "Insert a new entry", time: "O(1) avg", desc: "Compute hash, store at that slot", verdict: "✦" },
            { op: "Delete an entry", time: "O(1) avg", desc: "Compute hash, remove from that slot", verdict: "✦" },
            { op: "Check if key exists", time: "O(1) avg", desc: "Same as lookup — hash and check", verdict: "✦" },
            { op: "Iterate all entries", time: "O(n)", desc: "Must visit every bucket", verdict: "◈" },
            { op: "Find min/max value", time: "O(n)", desc: "No ordering — must check everything", verdict: "✧" },
        ],
        simData: { type: "hash", initial: [["Alice", 95], ["Bob", 82], ["Charlie", 91], ["Diana", 78]] },
    },
    {
        id: "stack", name: "Stack", icon: "📚",
        subtitle: "Last In, First Out",
        heroColor: T.roseLight,
        intro: "Think of a stack of plates in a cafeteria. You can only add a plate on top, and you can only take a plate from the top. You cannot reach into the middle or pull from the bottom. The last plate placed is the first one taken. This simple rule — Last In, First Out — is surprisingly powerful.",
        whyCreated: "In the late 1950s, computer scientists faced two problems: how to evaluate mathematical expressions like (3 + 4) × (5 − 2), and how to handle function calls that nest inside each other (function A calls function B, which calls function C). Both problems have a natural 'nesting' structure — the most recently opened thing must be closed first. The stack was formalized to handle exactly this pattern.",
        painBefore: "Without stacks, your computer can't run programs. Seriously. When function main() calls function calculate(), which calls function multiply(), the computer needs to remember: 'after multiply is done, go back to calculate; after calculate is done, go back to main.' This remembering is literally a stack of return addresses. Without it, there's no recursion, no nested function calls — your programs can only be flat sequences of instructions. Also: no undo button (the most recent action must be undone first), no matching of parentheses, no browser back button.",
        whatBreaks: "Every programming language uses a 'call stack' for function execution — remove it, and no program can run. The 'undo' feature in every text editor disappears. Your browser's back button (a stack of visited URLs) stops working. Calculator apps can't evaluate expressions with parentheses. Depth-first search, the backbone of many graph algorithms, needs reimplementation. Code syntax checking (matching { } and ( )) becomes far harder.",
        howItWorks: "A stack supports only three operations: push (add to top), pop (remove from top), and peek (look at the top without removing). That's it. You cannot access the 3rd element. You cannot search for a value. You cannot insert in the middle.\n\nIn Python, you just use a regular list: append() is push, pop() is pop, and [-1] is peek. All O(1).\n\nThe power comes from the LIFO constraint: because you always process the most recent item first, stacks naturally handle anything with nesting or reversal — matching opening/closing brackets, undoing actions in reverse order, and exploring depth-first.",
        realWorld: [
            { name: "Ctrl+Z (Undo)", desc: "Every action you perform is pushed onto a stack. When you press undo, the most recent action is popped and reversed. Redo is a second stack that receives the undone actions." },
            { name: "Browser Back Button", desc: "Each page you visit is pushed onto a stack. Clicking 'back' pops the current page and reveals the previous one. The 'forward' button uses a separate stack." },
            { name: "Function Calls", desc: "When main() calls foo(), which calls bar(), the call stack is: [main, foo, bar]. When bar() finishes, it's popped, and execution returns to foo. This happens millions of times per second in any running program." },
            { name: "Parentheses Matching", desc: "Code editors check that every { has a matching }. They push opening brackets onto a stack. When a closing bracket appears, they pop and check if it matches. If the stack is empty at the end, the brackets are balanced." },
        ],
        ops: [
            { op: "Push (add to top)", time: "O(1)", desc: "Place item on top of the stack", verdict: "✦" },
            { op: "Pop (remove top)", time: "O(1)", desc: "Remove and return the top item", verdict: "✦" },
            { op: "Peek (view top)", time: "O(1)", desc: "Look at top item without removing", verdict: "✦" },
            { op: "Search for a value", time: "O(n)", desc: "Must pop items to find it (destructive)", verdict: "✧" },
            { op: "Access i-th element", time: "O(n)", desc: "Not supported — stack is not indexed", verdict: "✧" },
        ],
        simData: { type: "stack", initial: [10, 20, 30] },
    },
    {
        id: "linkedList", name: "Linked List", icon: "⛓",
        subtitle: "The Dynamic Chain",
        heroColor: "#7B4F8A",
        intro: "Imagine a scavenger hunt. Each clue card has two things written on it: the actual clue, and the address of where the NEXT clue is hidden. To find clue #7, you must start at clue #1 and follow the chain — you can't jump ahead. But here's the superpower: adding a new clue between #3 and #4 is effortless — just change the address written on card #3. No need to move any other cards.",
        whyCreated: "In 1955-56, Allen Newell, Cliff Shaw, and Herbert Simon at RAND Corporation were building some of the first AI programs. They needed data that could grow and shrink dynamically — arrays were fixed-size in early languages and inserting in the middle required shifting everything. They invented nodes connected by pointers, creating the linked list.",
        painBefore: "With arrays, inserting a passenger into the middle of a 10,000-person airline manifest meant physically shifting 5,000 records — one by one. Deleting someone from position 500 meant shifting 9,500 records to close the gap. Memory was scarce in the 1950s, so you couldn't just allocate a huge array 'just in case.' You needed a structure that used exactly as much memory as the data required.",
        whatBreaks: "Python's collections.deque (the correct way to implement queues) IS a doubly-linked list — remove linked lists and efficient queues vanish. LRU caches (used in every browser, database, and CDN) combine a linked list with a hash table — they break. Your text editor's undo history often uses a linked list. Operating system memory allocation uses 'free lists' (linked lists of available memory blocks). Even blockchain is conceptually a linked list — each block points to the previous one.",
        howItWorks: "A linked list is a chain of 'nodes.' Each node contains two things: the data it's holding, and a pointer (address) to the next node. The first node is called the 'head.' The last node's pointer is None (null) — meaning the chain ends here.\n\nTo insert a new node between nodes A and B: create the new node, point it to B, then change A's pointer to the new node. Two pointer changes — that's it. No shifting of any other data. This is O(1).\n\nThe tradeoff: you can't jump to the 50th element like you can with an array. You have to start at the head and follow 50 pointers. That's O(n). It's the fundamental tradeoff: instant insertion vs instant access.",
        realWorld: [
            { name: "Browser History", desc: "Each page you visit becomes a node pointing to the previous page. Clicking 'back' follows the pointer to the previous node. 'Forward' follows the pointer in the other direction (doubly-linked)." },
            { name: "LRU Cache", desc: "When your browser cache is full and needs to evict something, it removes the Least Recently Used item. A linked list keeps items in order of recency — moving an accessed item to the front is O(1)." },
            { name: "Music Playlist", desc: "Spotify's play queue is like a linked list. The current song points to the next song. Shuffling rearranges the pointers. Adding a song to 'play next' just inserts a node after the current one." },
            { name: "Blockchain", desc: "Each block in Bitcoin's blockchain contains a hash (pointer) to the previous block. This chain of blocks is essentially a singly-linked list where tampering with one block breaks all subsequent links." },
        ],
        ops: [
            { op: "Access by index", time: "O(n)", desc: "Must walk from the head, node by node", verdict: "✧" },
            { op: "Insert at head", time: "O(1)", desc: "Create node, point to old head", verdict: "✦" },
            { op: "Insert after a node", time: "O(1)", desc: "Just change two pointers", verdict: "✦" },
            { op: "Delete head", time: "O(1)", desc: "Move head to head.next", verdict: "✦" },
            { op: "Search for a value", time: "O(n)", desc: "Walk the chain and compare each node", verdict: "✧" },
            { op: "Reverse the list", time: "O(n)", desc: "Walk once, flip all pointers", verdict: "◈" },
        ],
        simData: { type: "linkedList", initial: [10, 25, 42, 67] },
    },
    {
        id: "queue", name: "Queue", icon: "🚶",
        subtitle: "First In, First Out",
        heroColor: "#3B6BC7",
        intro: "A queue is exactly what it sounds like — a line of people waiting. The first person who joins the line is the first person served. New people join at the back. People leave from the front. No cutting allowed. This simple 'fairness' rule — First In, First Out — turns out to be essential for computing.",
        whyCreated: "Queues were formalized alongside stacks in the late 1950s. The driving need was CPU scheduling — when multiple programs are waiting to run on a shared computer, which one goes first? A stack would always run the newest job (unfair!). A queue ensures the program that's been waiting the longest gets served first.",
        painBefore: "Without queues, there's no fair scheduling. Imagine a printer shared by 20 people. Without a queue, the last person to click 'print' would always go first (stack behavior), and the first person could wait forever. This is called 'starvation' — and it plagued early computing systems. Also: BFS (breadth-first search), the algorithm that finds shortest paths in networks, fundamentally requires a queue to work.",
        whatBreaks: "BFS disappears — and with it, shortest-path finding in unweighted graphs, level-by-level tree traversal, and many network algorithms. Message queues (Kafka, RabbitMQ, AWS SQS) that power modern microservices architecture stop existing. Print queues vanish. Web servers can't handle requests fairly. Operating system task schedulers break. Even the 'order processing' system of every online store uses a queue.",
        howItWorks: "A queue supports two main operations: enqueue (add to the back) and dequeue (remove from the front). That's it. Like a pipe — data goes in one end and comes out the other, always in order.\n\nCritical Python detail: NEVER use a regular list as a queue. list.pop(0) is O(n) because it shifts all remaining elements. Instead, use collections.deque — it's a doubly-linked list that gives O(1) for both ends.\n\nThe most important use of a queue in algorithms is BFS: you add all neighbors of the current node to the queue, then process them in the order they were added — guaranteeing you explore level by level.",
        realWorld: [
            { name: "BFS (Shortest Path)", desc: "To find the shortest route in an unweighted network (like minimum moves in a game), BFS uses a queue to explore all options at distance 1 before any at distance 2, then distance 3, and so on." },
            { name: "Message Queues", desc: "When you place an order on Amazon, it goes into a message queue. The order processing system reads from the front of the queue. This decouples 'receiving orders' from 'processing orders,' allowing the system to handle spikes." },
            { name: "Print Queue", desc: "When 5 people send documents to a shared printer, each document enters the queue. The printer processes them first-come-first-served. You can see the queue in your computer's printer settings." },
            { name: "Customer Support", desc: "When you call a helpline and hear 'you are number 4 in the queue,' that's a literal queue data structure tracking callers in order of arrival." },
        ],
        ops: [
            { op: "Enqueue (add to back)", time: "O(1)", desc: "Place at the end of the line", verdict: "✦" },
            { op: "Dequeue (remove front)", time: "O(1)", desc: "Serve the person at the front", verdict: "✦" },
            { op: "Peek front", time: "O(1)", desc: "Look at front without removing", verdict: "✦" },
            { op: "Search", time: "O(n)", desc: "Must scan through the queue", verdict: "✧" },
            { op: "Access i-th element", time: "O(n)", desc: "Queue is not indexed", verdict: "✧" },
        ],
        simData: { type: "queue", initial: [10, 20, 30, 40] },
    },
    {
        id: "tree", name: "Tree", icon: "🌲",
        subtitle: "Hierarchy & Fast Search",
        heroColor: "#2D7A5F",
        intro: "Think of your computer's file system. You have a main folder (root), inside it are sub-folders, inside those are more sub-folders and files. This nesting — where each item has exactly one parent and can have multiple children — is a tree. In computing, trees aren't just for hierarchy: a Binary Search Tree can find any item among millions in about 20 steps.",
        whyCreated: "Trees emerged in the early 1960s when researchers needed two things that flat structures (arrays, linked lists) couldn't provide: (1) hierarchical relationships — like a company org chart where each employee has one boss, and (2) fast search combined with fast insertion. A sorted array gave O(log n) search but O(n) insertion. A BST gives O(log n) for BOTH.",
        painBefore: "Imagine trying to organize a company of 10,000 employees using only a flat list. Who reports to whom? What department is someone in? With a flat structure, you'd need separate lists for each relationship. And for searching: sorted arrays let you search in O(log n) using binary search, but every time a new employee joins, you'd have to shift thousands of entries to keep it sorted. Trees solve both problems elegantly.",
        whatBreaks: "File systems collapse — no more nested folders, just a flat list of every file on your computer. HTML can't exist (the DOM is a tree — every <div> inside another <div> is a parent-child relationship). Database indexes vanish (B-Trees are what make databases fast). JSON and XML become impossible to parse. Compilers can't work (they build Abstract Syntax Trees from your code). AI decision trees disappear. Huffman compression breaks.",
        howItWorks: "A tree starts with a single 'root' node. Each node can have zero or more 'children.' A node with no children is called a 'leaf.' The distance from the root to the deepest leaf is the tree's 'height.'\n\nA Binary Search Tree (BST) adds a crucial rule: for every node, all values in its LEFT subtree are smaller, and all values in its RIGHT subtree are larger. This means searching works like binary search: at each node, you eliminate half the remaining tree.\n\nThe danger: if you insert values in sorted order (1, 2, 3, 4, 5), the tree degenerates into a linked list — all on the right side. This is why self-balancing trees (AVL, Red-Black) were invented: they automatically rearrange after each insertion to stay balanced.",
        realWorld: [
            { name: "File System", desc: "Your computer's folder structure is a tree. The root folder (/ on Linux, C:\\ on Windows) is the root node. Each subfolder is a child. Files are leaves. 'cd ..' moves to the parent." },
            { name: "HTML DOM", desc: "Every webpage is a tree. The <html> tag is the root. Inside it: <head> and <body>. Inside <body>: <div>, <p>, <ul>. JavaScript's document.querySelector traverses this tree." },
            { name: "Database B-Tree Index", desc: "When you search a database with WHERE name = 'Alice', the database doesn't scan all rows. It uses a B-Tree index that narrows down the location in O(log n) steps — even with billions of rows." },
            { name: "Decision Trees (AI)", desc: "In machine learning, decision trees make predictions by asking a series of yes/no questions. 'Is age > 30?' → 'Is income > 50K?' Each question is a node, each answer branches to a child." },
        ],
        ops: [
            { op: "Search (balanced)", time: "O(log n)", desc: "Each comparison eliminates half the tree", verdict: "✦" },
            { op: "Insert (balanced)", time: "O(log n)", desc: "Find the right spot, add a leaf", verdict: "✦" },
            { op: "Delete (balanced)", time: "O(log n)", desc: "Find node, reorganize subtree", verdict: "✦" },
            { op: "In-order traversal", time: "O(n)", desc: "Visit every node in sorted order", verdict: "◈" },
            { op: "Find min/max", time: "O(log n)", desc: "Go all the way left/right", verdict: "✦" },
            { op: "Search (degenerate)", time: "O(n)", desc: "Worst case: tree is a linked list", verdict: "✧" },
        ],
        simData: { type: "tree", initial: [50, 30, 70, 20, 40, 60, 80] },
    },
    {
        id: "heap", name: "Heap", icon: "⏫",
        subtitle: "The Priority Machine",
        heroColor: "#D4773B",
        intro: "Imagine a hospital emergency room. Patients don't wait in order of arrival — they're treated by urgency. The most critical patient is always seen first, no matter when they arrived. When a new patient comes in, they're assessed and placed in the right priority position. This is exactly how a heap works — it always gives you the most important (smallest or largest) element instantly.",
        whyCreated: "J.W.J. Williams invented the binary heap in 1964, specifically for the heapsort algorithm. The key insight was brilliant: you can represent a complete binary tree as a flat array, using index arithmetic to find parents and children. No pointers needed. This made heaps both fast and memory-efficient.",
        painBefore: "You need to repeatedly find the minimum element from a collection that's constantly changing (like a scheduler picking the highest-priority task). With an unsorted array, finding the minimum scans every element — O(n) each time. With a sorted array, the minimum is at position 0 (O(1)), but inserting a new element requires shifting — O(n). You needed a structure where BOTH finding the min AND inserting are fast.",
        whatBreaks: "Dijkstra's shortest-path algorithm becomes much slower — O(V²) instead of O((V+E) log V). Operating systems can't efficiently pick the highest-priority process to run next. Timer systems (which event fires next?) degrade. Finding the median in streaming data becomes O(n) per element instead of O(log n). Huffman compression tree construction slows down. Priority-based task schedulers in web servers break.",
        howItWorks: "A min-heap is a complete binary tree where every parent is smaller than or equal to its children. The smallest element is ALWAYS at the root — that's the guarantee.\n\nBut it's NOT fully sorted! The left child and right child of a node have no ordering between themselves. The heap only guarantees the parent-child relationship.\n\nInsert: place the new element at the bottom-right (end of the array), then 'bubble up' — compare with parent, swap if smaller, repeat until the heap property is restored. This takes O(log n) because the tree height is log n.\n\nExtract min: remove the root (the min), move the last element to the root, then 'bubble down' — compare with both children, swap with the smaller one, repeat. Also O(log n).\n\nIn Python: import heapq. It's a min-heap. For max-heap, negate your values.",
        realWorld: [
            { name: "OS Task Scheduler", desc: "Your operating system runs hundreds of processes. The scheduler uses a priority queue (heap) to always pick the highest-priority process next. Every time you switch apps, a heap extraction happens." },
            { name: "Dijkstra's Algorithm", desc: "Google Maps finds the shortest route by always expanding the closest unvisited intersection first. A min-heap efficiently provides 'the closest unvisited node' at each step." },
            { name: "Median of a Stream", desc: "Streaming services compute running statistics. To maintain the median of incoming data, you use two heaps: a max-heap for the lower half and a min-heap for the upper half. The median is at the top of one of them." },
            { name: "Merge K Sorted Lists", desc: "When combining data from multiple sorted sources (like merging search results from different servers), a heap of size K always holds the smallest remaining element from each source." },
        ],
        ops: [
            { op: "Find min (or max)", time: "O(1)", desc: "Always at the root — just peek", verdict: "✦" },
            { op: "Insert", time: "O(log n)", desc: "Add at bottom, bubble up", verdict: "✦" },
            { op: "Extract min (or max)", time: "O(log n)", desc: "Remove root, bubble down", verdict: "✦" },
            { op: "Build heap from array", time: "O(n)", desc: "Surprisingly NOT O(n log n)", verdict: "✦" },
            { op: "Search for arbitrary value", time: "O(n)", desc: "Heap isn't sorted — must scan", verdict: "✧" },
        ],
        simData: { type: "heap", initial: [1, 3, 2, 7, 4, 5, 6] },
    },
    {
        id: "graph", name: "Graph", icon: "🕸",
        subtitle: "The Network of Everything",
        heroColor: "#2B2B40",
        intro: "Think of a subway map. Stations are connected by lines. Some lines are one-way. Some have different costs (express vs local). You can get between some stations multiple ways, and some stations might not be reachable at all. A graph is the mathematical model for any system where things are connected — and that's almost everything in the real world.",
        whyCreated: "Graph theory was born in 1736 when mathematician Leonhard Euler tackled the Königsberg Bridge Problem: 'Can you walk through the city crossing each of its 7 bridges exactly once?' Euler proved it was impossible by modeling the problem with nodes (land masses) and edges (bridges). Computational graph algorithms followed in the 1950s-60s with Dijkstra, Prim, Kruskal, and others.",
        painBefore: "Trees can only represent hierarchical relationships — each node has exactly one parent. But most real-world relationships aren't hierarchical. A road network has intersections connected to multiple other intersections with no clear 'parent.' Social networks have mutual friendships. The internet has routers connected to many other routers. Before graphs, there was no clean way to model, store, or traverse these networks.",
        whatBreaks: "GPS navigation vanishes entirely — route finding IS graph traversal. Social networks can't model or analyze connections (friend recommendations, community detection — all graph algorithms). The internet's routing protocol (BGP) breaks. Package managers (npm, pip) can't resolve dependencies (dependency graphs). Airline route planning stops. Recommendation engines (Netflix, YouTube) collapse. Google's PageRank — the algorithm that made Google, Google — is a graph algorithm.",
        howItWorks: "A graph G = (V, E) consists of vertices (nodes) V and edges (connections) E. That's it — no other rules. Unlike trees, there's no root, no parent-child constraint, and cycles are allowed.\n\nGraphs are stored in two main ways: (1) Adjacency list — a dictionary where each node maps to its list of neighbors. Space-efficient for sparse graphs. (2) Adjacency matrix — a 2D array where matrix[i][j] = 1 if there's an edge from i to j. Fast edge checking but uses O(V²) space.\n\nTwo fundamental traversal algorithms: BFS (breadth-first search) explores level by level using a queue — perfect for shortest paths. DFS (depth-first search) goes as deep as possible using a stack/recursion — perfect for exploring all paths, detecting cycles, and topological sorting.",
        realWorld: [
            { name: "Google Maps", desc: "Every intersection is a node. Every road is a weighted edge (weight = travel time). When you ask for directions, Dijkstra's algorithm (or A*) finds the shortest weighted path through this enormous graph." },
            { name: "Social Networks", desc: "On Facebook, each user is a node and each friendship is an edge. 'People you may know' uses graph algorithms to find users who are 2-3 edges away from you. Community detection finds clusters of tightly connected users." },
            { name: "Internet Routing", desc: "The internet is a graph of routers. When you load a webpage, your data packet traverses multiple routers. BGP (Border Gateway Protocol) uses graph algorithms to find efficient paths across the network." },
            { name: "npm / pip Dependencies", desc: "Each package is a node. Each dependency is a directed edge. 'npm install' builds a dependency graph and uses topological sort to determine the installation order — ensuring dependencies are installed before the packages that need them." },
        ],
        ops: [
            { op: "Add a node", time: "O(1)", desc: "Create a new entry in the adjacency list", verdict: "✦" },
            { op: "Add an edge", time: "O(1)", desc: "Append to the neighbor list", verdict: "✦" },
            { op: "Check if edge exists", time: "O(degree)", desc: "Scan neighbor list of the node", verdict: "◈" },
            { op: "BFS / DFS traversal", time: "O(V + E)", desc: "Visit every node and edge once", verdict: "◈" },
            { op: "Shortest path (Dijkstra)", time: "O((V+E) log V)", desc: "Using a min-heap for efficiency", verdict: "◈" },
            { op: "Detect cycle", time: "O(V + E)", desc: "DFS with back-edge detection", verdict: "◈" },
        ],
        simData: { type: "graph", initial: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"]] },
    },
];

// ─── SVG VISUALIZATIONS ────────────────────────────────────────────────────

const ArraySVG = ({ data, highlight = -1 }: { data: any[], highlight?: number }) => {
    const w = Math.min(70, 500 / data.length);
    return (
        <svg viewBox={`0 0 ${data.length * w + 20} 90`} style={{ width: "100%", maxWidth: 600, display: "block" }}>
            {data.map((val, i) => (
                <g key={i}>
                    <rect x={10 + i * w} y={10} width={w - 4} height={50} rx={6}
                        fill={i === highlight ? T.rose : "#FFF"} stroke={i === highlight ? T.roseDark : T.border} strokeWidth={1.5} />
                    <text x={10 + i * w + (w - 4) / 2} y={42} textAnchor="middle" fontSize={16} fontWeight={600}
                        fontFamily="'JetBrains Mono'" fill={i === highlight ? "#FFF" : T.text}>{val}</text>
                    <text x={10 + i * w + (w - 4) / 2} y={78} textAnchor="middle" fontSize={10}
                        fontFamily="'Outfit'" fill={T.textLight}>{i}</text>
                </g>
            ))}
        </svg>
    );
};

const HashSVG = ({ entries }: { entries: any[] }) => {
    const bucketCount = 8;
    const buckets = Array(bucketCount).fill(null);
    entries.forEach(([k, v]) => {
        const h = [...k].reduce((a, c) => a + c.charCodeAt(0), 0) % bucketCount;
        buckets[h] = { key: k, val: v, hash: h };
    });
    return (
        <svg viewBox="0 0 520 200" style={{ width: "100%", maxWidth: 560, display: "block" }}>
            <text x={20} y={20} fontSize={11} fontFamily="'Outfit'" fill={T.textLight}>hash(key) % {bucketCount} → bucket index</text>
            {Array(bucketCount).fill(0).map((_, i) => {
                const b = buckets[i];
                return (
                    <g key={i}>
                        <rect x={10} y={30 + i * 20} width={40} height={17} rx={3} fill={T.rosePale} stroke={T.roseLight} strokeWidth={0.5} />
                        <text x={30} y={43 + i * 20} textAnchor="middle" fontSize={10} fontFamily="'JetBrains Mono'" fill={T.roseDark}>{i}</text>
                        {b ? (
                            <>
                                <line x1={52} y1={38 + i * 20} x2={80} y2={38 + i * 20} stroke={T.rose} strokeWidth={1.5} markerEnd="url(#arrowR)" />
                                <rect x={82} y={30 + i * 20} width={160} height={17} rx={4} fill={T.rose} />
                                <text x={162} y={43 + i * 20} textAnchor="middle" fontSize={10} fontFamily="'Outfit'" fill="#FFF" fontWeight={600}>{b.key}: {b.val}</text>
                            </>
                        ) : (
                            <text x={70} y={43 + i * 20} fontSize={10} fontFamily="'Outfit'" fill={T.textLight}>empty</text>
                        )}
                    </g>
                );
            })}
            <defs><marker id="arrowR" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={T.rose} /></marker></defs>
        </svg>
    );
};

const StackSVG = ({ data, action }: { data: any[], action?: any }) => (
      <svg viewBox="0 0 180 220" style={{ width: 180, display: "block" }}>
        <text x={90} y={16} textAnchor="middle" fontSize={10} fontFamily="'Outfit'" fill={T.textLight} fontWeight={600}>TOP ↓</text>
        {[...data].reverse().map((val, i) => (
            <g key={i}>
                <rect x={30} y={24 + i * 42} width={120} height={36} rx={8}
                    fill={i === 0 ? T.rose : "#FFF"} stroke={i === 0 ? T.roseDark : T.border} strokeWidth={1.5} />
                <text x={90} y={48 + i * 42} textAnchor="middle" fontSize={18} fontWeight={700}
                    fontFamily="'JetBrains Mono'" fill={i === 0 ? "#FFF" : T.text}>{val}</text>
            </g>
        ))}
        {data.length === 0 && <text x={90} y={100} textAnchor="middle" fontSize={13} fontFamily="'Outfit'" fill={T.textLight}>Stack is empty</text>}
    </svg>
);

// ─── SIMULATOR COMPONENT ───────────────────────────────────────────────────

const ArraySimulator = ({ initial }: { initial: any[] }) => {
    const [arr, setArr] = useState([...initial]);
    const [input, setInput] = useState("");
    const [highlight, setHighlight] = useState(-1);
    const [log, setLog] = useState(["Array initialized with 7 elements."]);

    const addLog = (msg) => setLog(prev => [msg, ...prev].slice(0, 6));

    const pushVal = () => {
        const v = parseInt(input);
        if (isNaN(v)) return;
        setArr(p => [...p, v]);
        setHighlight(arr.length);
        addLog(`Appended ${v} at index ${arr.length}. O(1) — just placed at the end.`);
        setInput("");
        setTimeout(() => setHighlight(-1), 1200);
    };

    const popVal = () => {
        if (arr.length === 0) return;
        const removed = arr[arr.length - 1];
        setArr(p => p.slice(0, -1));
        addLog(`Removed ${removed} from end. O(1) — no shifting needed.`);
    };

    const searchVal = () => {
        const v = parseInt(input);
        if (isNaN(v)) return;
        const idx = arr.indexOf(v);
        if (idx >= 0) {
            setHighlight(idx);
            addLog(`Found ${v} at index ${idx}. Checked ${idx + 1} element(s). O(n) linear search.`);
            setTimeout(() => setHighlight(-1), 2000);
        } else {
            addLog(`${v} not found. Checked all ${arr.length} elements. O(n) worst case.`);
        }
        setInput("");
    };

    return (
        <div>
            <ArraySVG data={arr} highlight={highlight} />
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a number..."
                    onKeyDown={e => e.key === "Enter" && pushVal()}
                    style={{ padding: "8px 14px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 14, width: 160, background: "#FFF" }} />
                <Btn onClick={pushVal} label="Append" />
                <Btn onClick={popVal} label="Pop End" variant="outline" />
                <Btn onClick={searchVal} label="Search" variant="outline" />
                <Btn onClick={() => { setArr([...arr].sort((a, b) => a - b)); addLog(`Sorted! O(n log n) using TimSort.`); }} label="Sort" variant="outline" />
            </div>
            <div style={{ marginTop: 14, padding: 14, background: T.roseMist, borderRadius: 10, maxHeight: 120, overflow: "auto" }}>
                {log.map((l, i) => (
                    <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: i === 0 ? T.roseDark : T.textMuted, padding: "3px 0", opacity: i === 0 ? 1 : 0.6 }}>
                        {i === 0 && "→ "}{l}
                    </div>
                ))}
            </div>
        </div>
    );
};

const StackSimulator = ({ initial }: { initial: any[] }) => {
    const [stack, setStack] = useState([...initial]);
    const [input, setInput] = useState("");
    const [log, setLog] = useState(["Stack initialized."])
    const addLog = (m) => setLog(p => [m, ...p].slice(0, 6));

    return (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <StackSVG data={stack} />
            <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Value..."
                        onKeyDown={e => e.key === "Enter" && (() => { const v = parseInt(input); if (!isNaN(v)) { setStack(p => [...p, v]); addLog(`Push ${v}. Stack size: ${stack.length + 1}. O(1).`); setInput(""); } })()}
                        style={{ padding: "8px 12px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 14, width: 100, background: "#FFF" }} />
                    <Btn label="Push" onClick={() => { const v = parseInt(input); if (!isNaN(v)) { setStack(p => [...p, v]); addLog(`Push ${v}. O(1).`); setInput(""); } }} />
                    <Btn label="Pop" variant="outline" onClick={() => { if (stack.length === 0) return addLog("Stack is empty! Cannot pop."); const v = stack[stack.length - 1]; setStack(p => p.slice(0, -1)); addLog(`Pop → ${v}. O(1).`); }} />
                    <Btn label="Peek" variant="outline" onClick={() => { if (stack.length === 0) return addLog("Stack is empty!"); addLog(`Peek → ${stack[stack.length - 1]}. O(1). (not removed)`); }} />
                </div>
                <div style={{ padding: 12, background: T.roseMist, borderRadius: 10, maxHeight: 140, overflow: "auto" }}>
                    {log.map((l, i) => (
                        <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: i === 0 ? T.roseDark : T.textMuted, padding: "2px 0", opacity: i === 0 ? 1 : 0.5 }}>{i === 0 && "→ "}{l}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HashSimulator = ({ initial }: { initial: any[] }) => {
    const [entries, setEntries] = useState([...initial]);
    const [keyIn, setKeyIn] = useState("");
    const [valIn, setValIn] = useState("");
    const [log, setLog] = useState(["Hash table initialized."]);
    const addLog = (m) => setLog(p => [m, ...p].slice(0, 6));

    const insert = () => {
        if (!keyIn) return;
        const h = [...keyIn].reduce((a, c) => a + c.charCodeAt(0), 0) % 8;
        setEntries(p => [...p.filter(e => e[0] !== keyIn), [keyIn, valIn || "?"]]);
        addLog(`Insert "${keyIn}": hash = ${h}. Stored at bucket ${h}. O(1).`);
        setKeyIn(""); setValIn("");
    };

    return (
        <div>
            <HashSVG entries={entries} />
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <input value={keyIn} onChange={e => setKeyIn(e.target.value)} placeholder="Key..." style={{ padding: "8px 12px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 13, width: 100, background: "#FFF" }} />
                <input value={valIn} onChange={e => setValIn(e.target.value)} placeholder="Value..." style={{ padding: "8px 12px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 13, width: 80, background: "#FFF" }} />
                <Btn label="Insert" onClick={insert} />
                <Btn label="Lookup" variant="outline" onClick={() => {
                    const found = entries.find(e => e[0] === keyIn);
                    if (found) addLog(`Lookup "${keyIn}" → ${found[1]}. O(1) average.`);
                    else addLog(`"${keyIn}" not found.`);
                }} />
            </div>
            <div style={{ marginTop: 12, padding: 12, background: T.roseMist, borderRadius: 10, maxHeight: 100, overflow: "auto" }}>
                {log.map((l, i) => <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: i === 0 ? T.roseDark : T.textMuted, padding: "2px 0", opacity: i === 0 ? 1 : 0.5 }}>{i === 0 && "→ "}{l}</div>)}
            </div>
        </div>
    );
};

// ─── SMALL UI COMPONENTS ───────────────────────────────────────────────────

const Btn = ({ label, onClick, variant = "filled" }: { label: string, onClick?: () => void, variant?: "filled" | "outline" }) => (
    <button onClick={onClick} style={{
        padding: "8px 18px", border: variant === "outline" ? `1.5px solid ${T.rose}` : "none",
        borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit'", fontSize: 13, fontWeight: 600,
        background: variant === "outline" ? "transparent" : T.rose,
        color: variant === "outline" ? T.rose : "#FFF",
        transition: "all 0.15s",
    }}>{label}</button>
);

// ─── CHAPTER RENDERER ──────────────────────────────────────────────────────

const Chapter = ({ ch }: { ch: any }) => (
    <div style={{ marginBottom: 80 }}>
        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, ${ch.heroColor}, ${T.roseDark})`, borderRadius: 24, padding: "48px 40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, fontSize: 180, opacity: 0.08, lineHeight: 1 }}>{ch.icon}</div>
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "'Outfit'", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Chapter</div>
                <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 42, fontWeight: 800, color: "#FFF", margin: "0 0 8px", lineHeight: 1.1 }}>{ch.name}</h2>
                <p style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 400, color: "rgba(255,255,255,0.8)", margin: 0, fontStyle: "italic" }}>{ch.subtitle}</p>
            </div>
        </div>

        {/* Introduction */}
        <div style={{ maxWidth: 720, margin: "0 auto 48px" }}>
            <p style={{ fontFamily: "'Playfair Display'", fontSize: 20, lineHeight: 1.8, color: T.text, margin: 0 }}>{ch.intro}</p>
        </div>

        {/* Why Was It Created */}
        <SectionBlock icon="🕰" title="Why Was It Created?" color={T.rose}>
            <p style={proseStyle}>{ch.whyCreated}</p>
        </SectionBlock>

        {/* The Pain Before */}
        <SectionBlock icon="😤" title="The World Before This Existed" color={T.orange}>
            <p style={proseStyle}>{ch.painBefore}</p>
        </SectionBlock>

        {/* What Breaks Without It */}
        <SectionBlock icon="💥" title="What Breaks If You Remove It" color="#C0392B">
            <p style={proseStyle}>{ch.whatBreaks}</p>
        </SectionBlock>

        {/* How It Works */}
        <SectionBlock icon="⚙️" title="How It Actually Works" color={T.blue}>
            {ch.howItWorks.split("\n\n").map((para, i) => <p key={i} style={{ ...proseStyle, marginBottom: 16 }}>{para}</p>)}
        </SectionBlock>

        {/* Interactive Simulator */}
        <SectionBlock icon="🧪" title="Try It Yourself — Live Simulator" color={T.roseDark}>
            {ch.simData.type === "array" && <ArraySimulator initial={ch.simData.initial} />}
            {ch.simData.type === "hash" && <HashSimulator initial={ch.simData.initial} />}
            {ch.simData.type === "stack" && <StackSimulator initial={ch.simData.initial} />}
            {ch.simData.type === "linkedList" && <LinkedListSimulator initial={ch.simData.initial} />}
            {ch.simData.type === "queue" && <QueueSimulator initial={ch.simData.initial} />}
            {ch.simData.type === "tree" && <GenericSimulator type="Binary Search Tree" initial={ch.simData.initial} />}
            {ch.simData.type === "heap" && <GenericSimulator type="Min-Heap" initial={ch.simData.initial} />}
            {ch.simData.type === "graph" && <GenericSimulator type="Graph" initial={ch.simData.initial} />}
        </SectionBlock>

        {/* Operations Table */}
        <SectionBlock icon="📊" title="Operations & Their Speed" color={T.green}>
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 40px", background: T.roseDark, padding: "12px 16px" }}>
                    {["Operation", "Speed", "What Happens", ""].map(h => <div key={h} style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: "#FFF", letterSpacing: 0.5 }}>{h}</div>)}
                </div>
                {ch.ops.map((o, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 40px", padding: "12px 16px", background: i % 2 === 0 ? "#FFF" : T.offWhite, borderTop: `1px solid ${T.border}` }}>
                        <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 600, color: T.text }}>{o.op}</div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600, color: o.time.includes("1)") && !o.time.includes("n") ? T.green : o.time.includes("log") ? T.blue : T.rose }}>{o.time}</div>
                        <div style={{ fontFamily: "'Outfit'", fontSize: 13, color: T.textMuted }}>{o.desc}</div>
                        <div style={{ fontSize: 16, textAlign: "center" }}>{o.verdict}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 12, fontFamily: "'Outfit'", fontSize: 12, color: T.textLight }}>
                <span>✦ Excellent</span><span>◈ Good</span><span>✧ Expensive</span>
            </div>
        </SectionBlock>

        {/* Real-World Use Cases */}
        <SectionBlock icon="🌍" title="Where It's Used in the Real World" color={T.roseDark}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {ch.realWorld.map((rw, i) => (
                    <div key={i} style={{ background: "#FFF", borderRadius: 14, padding: 20, border: `1px solid ${T.border}` }}>
                        <h4 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 700, color: T.rose, margin: "0 0 8px" }}>{rw.name}</h4>
                        <p style={{ fontFamily: "'Outfit'", fontSize: 13, lineHeight: 1.7, color: T.textMuted, margin: 0 }}>{rw.desc}</p>
                    </div>
                ))}
            </div>
        </SectionBlock>
    </div>
);

const proseStyle = { fontFamily: "'Outfit'", fontSize: 16, lineHeight: 1.85, color: "#333", margin: 0 };

const SectionBlock = ({ icon, title, color, children }: { icon: string, title: string, color: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 700, color, margin: 0 }}>{title}</h3>
        </div>
        <div style={{ paddingLeft: 8 }}>{children}</div>
    </div>
);

// ─── TIMELINE VIEW ─────────────────────────────────────────────────────────

const TimelineView = () => (
    <div>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>The History of DSA</h2>
            <p style={{ fontFamily: "'Playfair Display'", fontSize: 17, color: T.textMuted, fontStyle: "italic", margin: 0 }}>Every structure was invented because something was too slow or impossible</p>
        </div>
        <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 14, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${T.rose}, ${T.rosePale})` }} />
            {TIMELINE.map((ev, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 32, paddingLeft: 28 }}>
                    <div style={{ position: "absolute", left: -24, top: 4, width: 16, height: 16, borderRadius: "50%", background: T.rose, border: `3px solid ${T.rosePale}` }} />
                    <div style={{ background: "#FFF", borderRadius: 16, padding: "24px 28px", border: `1px solid ${T.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: T.rose }}>{ev.year}</span>
                            <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>{ev.title}</h3>
                            <span style={{ fontFamily: "'Outfit'", fontSize: 12, color: T.textLight }}>by {ev.who}</span>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: T.orange, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>The Problem</div>
                            <p style={{ fontFamily: "'Outfit'", fontSize: 14, lineHeight: 1.75, color: "#444", margin: 0 }}>{ev.problem}</p>
                        </div>
                        <div>
                            <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: T.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>The Impact</div>
                            <p style={{ fontFamily: "'Outfit'", fontSize: 14, lineHeight: 1.75, color: "#444", margin: 0 }}>{ev.impact}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── NAVIGATION ────────────────────────────────────────────────────────────

const SECTIONS = [
    { id: "chapters", label: "The Book", icon: "📖" },
    { id: "timeline", label: "Timeline", icon: "🕰" },
    { id: "compare", label: "Compare", icon: "⇄" },
    { id: "patterns", label: "Patterns", icon: "◆" },
    { id: "pipeline", label: "Pipeline", icon: "⚡" },
    { id: "complexity", label: "Complexity", icon: "📈" },
];

const TopNav = ({ section, setSection }: { section: string, setSection: (s: string) => void }) => (
    <nav style={{ display: "flex", gap: 2, padding: 4, background: "rgba(158,43,74,0.06)", borderRadius: 14, marginBottom: 40, position: "sticky", top: 12, zIndex: 100, backdropFilter: "blur(12px)" }}>
        {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
                flex: 1, padding: "12px 8px", border: "none", borderRadius: 11, cursor: "pointer",
                fontFamily: "'Outfit'", fontSize: 14, fontWeight: section === s.id ? 700 : 500,
                background: section === s.id ? T.rose : "transparent",
                color: section === s.id ? "#FFF" : T.textMuted,
                transition: "all 0.2s ease-out",
            }}>
                <span style={{ marginRight: 6 }}>{s.icon}</span>{s.label}
            </button>
        ))}
    </nav>
);

// ─── PATTERNS DETAIL VIEW ──────────────────────────────────────────────────

const PATTERN_DETAILS = [
    {
        name: "Two Pointers", icon: "👉👈", complexity: "O(n)", when: "The input is sorted (or can be sorted) and you're looking for pairs or triplets that satisfy a condition.",
        howItWorks: "Place one pointer at the start and one at the end of a sorted array. Check the sum (or other condition) of the elements at both pointers. If the result is too small, move the left pointer right (to increase it). If too large, move the right pointer left (to decrease it). The pointers converge toward each other, and you never revisit an element — so it's O(n) instead of O(n²).",
        analogy: "Imagine you're at a buffet with dishes numbered 1 to 100 by spiciness. You want to find two dishes that together have a spiciness of exactly 80. You taste the mildest (1) and spiciest (100). Total: 101 — too hot. Drop the spicy one, try 99. Still too hot. Keep going. Eventually you'll find the perfect pair without tasting every combination.",
        problems: ["Two Sum II (sorted) #167", "3Sum #15", "Container With Most Water #11", "Trapping Rain Water #42"]
    },
    {
        name: "Sliding Window", icon: "🪟", complexity: "O(n)", when: "You need to examine all contiguous subarrays or substrings of a certain property — like 'longest substring without repeating characters' or 'maximum sum of K consecutive elements'.",
        howItWorks: "Maintain a 'window' defined by two pointers: left and right. Expand the window by moving right. When the window violates your constraint, shrink it by moving left. At each step, update your answer. The key insight: instead of recomputing the window from scratch each time, you incrementally add/remove one element — so each element is processed at most twice.",
        analogy: "You're reading a long scroll through a magnifying glass that shows 5 lines at a time. Instead of re-reading all 5 lines each time you scroll down by one, you just note the new line that appeared at the bottom and forget the line that disappeared at the top.",
        problems: ["Max Sum Subarray of Size K", "Longest Substring Without Repeating Chars #3", "Minimum Window Substring #76", "Permutation in String #567"]
    },
    {
        name: "Binary Search", icon: "🔍", complexity: "O(log n)", when: "The data is sorted, or there's a monotonic property — meaning 'all false then all true' (or vice versa) in some answer space.",
        howItWorks: "Look at the middle element. If it's your target, done. If your target is larger, ignore the left half. If smaller, ignore the right half. Repeat. Each step eliminates HALF the remaining possibilities. For 1 million elements, you need at most 20 steps (log₂ of 1,000,000 ≈ 20).\n\nThe advanced insight: binary search works on ANY monotonic function, not just sorted arrays. 'What's the minimum speed to finish a task in H hours?' — if speed K works, all speeds above K also work. Binary search the answer space!",
        analogy: "The classic number guessing game. 'I'm thinking of a number between 1 and 1000.' You guess 500. 'Too high.' You guess 250. 'Too low.' You guess 375... In at most 10 guesses, you find any number out of 1000.",
        problems: ["Binary Search #704", "Search in Rotated Sorted Array #33", "Koko Eating Bananas #875", "Find Minimum in Rotated Sorted Array #153"]
    },
    {
        name: "Dynamic Programming", icon: "📋", complexity: "Varies (n, n², n×W)", when: "The problem asks for min/max/count of something, AND it can be broken into overlapping subproblems (the same smaller problem is solved multiple times in a naive recursive approach).",
        howItWorks: "Step 1: Define what dp[i] represents in words (e.g., 'the minimum coins to make amount i'). Step 2: Write the recurrence — how dp[i] relates to smaller values (e.g., dp[i] = min(dp[i-coin] + 1) for each coin). Step 3: Set base cases (dp[0] = 0). Step 4: Fill the table from small to large. Step 5: The answer is in dp[target].\n\nThe core insight: instead of computing the same subproblem millions of times (like naive Fibonacci which recomputes fib(3) hundreds of times), compute it ONCE and store the result.",
        analogy: "You're planning a road trip and keep a journal. Every time you figure out the best route from your city to checkpoint X, you write it down. If later you need the answer again (because X is part of multiple routes), you just look in your journal instead of re-driving the entire route.",
        problems: ["Climbing Stairs #70", "Coin Change #322", "House Robber #198", "Longest Common Subsequence #1143", "Edit Distance #72"]
    },
    {
        name: "Backtracking", icon: "↩️", complexity: "O(2ⁿ) or O(n!)", when: "You need to generate all valid combinations, permutations, or arrangements that satisfy constraints. Or you're solving a constraint satisfaction problem like Sudoku or N-Queens.",
        howItWorks: "Build a solution incrementally, one choice at a time. At each step: (1) make a choice, (2) recursively explore what follows, (3) UNDO the choice and try the next option. The 'undo' step is what makes it backtracking. If a partial solution can't possibly lead to a valid complete solution, prune that branch early.",
        analogy: "You're in a maze. At each fork, you pick one path and follow it. If you hit a dead end, you walk back to the last fork (backtrack) and try the other path. You never waste time exploring paths beyond a dead end.",
        problems: ["Subsets #78", "Permutations #46", "Combination Sum #39", "N-Queens #51", "Word Search #79"]
    },
    {
        name: "BFS (Breadth-First Search)", icon: "🌊", complexity: "O(V + E)", when: "You need the shortest path in an unweighted graph, or need to process nodes level by level, or explore all nodes at distance K before any at distance K+1.",
        howItWorks: "Start at a source node. Use a queue. Add the source. While the queue isn't empty: remove the front node, visit all its unvisited neighbors, add them to the queue. Because a queue is FIFO, nodes at distance 1 are all processed before any node at distance 2. This guarantees shortest paths in unweighted graphs.",
        analogy: "Drop a stone in a still pond. Ripples expand outward in concentric circles — every point at distance 1 from the center is reached before any point at distance 2. BFS is those ripples.",
        problems: ["Binary Tree Level Order #102", "Rotting Oranges #994", "Word Ladder #127", "Open the Lock #752", "Shortest Path in Binary Matrix #1091"]
    },
    {
        name: "DFS (Depth-First Search)", icon: "🕳️", complexity: "O(V + E)", when: "You need to explore all paths, detect cycles, perform topological sort, find connected components, or solve any problem that naturally recurses into smaller subproblems.",
        howItWorks: "Start at a node. Go to an unvisited neighbor. Go deeper. Keep going until you hit a dead end (no unvisited neighbors). Then backtrack to the previous node and try the next unvisited neighbor. Uses a stack (the call stack for recursive DFS, or an explicit stack for iterative).",
        analogy: "Exploring a cave system. You pick one tunnel and follow it as deep as it goes. Dead end? Walk back to the last fork and try the next tunnel. Mark each tunnel so you don't go in circles.",
        problems: ["Number of Islands #200", "Clone Graph #133", "Course Schedule #207", "Path Sum #112", "Pacific Atlantic Water Flow #417"]
    },
    {
        name: "Greedy", icon: "🏃", complexity: "Usually O(n log n)", when: "At each step, the locally optimal choice leads to the globally optimal solution. If you can prove (or argue) that a greedy strategy never needs to undo a previous choice, greedy works.",
        howItWorks: "Sort the data by some criteria. Then iterate through it, always making the 'best available' choice at each step without looking back. The key requirement is the 'greedy choice property' — making the best local choice must not prevent finding the global optimum.\n\nWarning: greedy doesn't always work! For Coin Change with coins [1, 3, 4] and amount 6: greedy picks 4+1+1 = 3 coins, but optimal is 3+3 = 2 coins. If greedy fails, use DP.",
        analogy: "At a buffet, you always grab the most appealing dish in front of you. Sometimes this works perfectly (activity selection). Sometimes you fill up on bread and miss the lobster (knapsack problem).",
        problems: ["Jump Game #55", "Gas Station #134", "Assign Cookies #455", "Task Scheduler #621", "Partition Labels #763"]
    },
    {
        name: "Merge Intervals", icon: "📊", complexity: "O(n log n)", when: "You have a list of intervals (start, end) and need to merge overlapping ones, find gaps, count overlaps, or determine minimum resources.",
        howItWorks: "Sort intervals by start time. Initialize a merged list with the first interval. For each subsequent interval: if it overlaps with the last merged interval (its start ≤ the last merged end), extend the last merged interval's end. Otherwise, add it as a new non-overlapping interval.",
        analogy: "You're looking at a daily calendar with overlapping meetings. Sort them by start time, then merge: if Meeting B starts before Meeting A ends, they overlap — combine them into one block. Keep going until no overlaps remain.",
        problems: ["Merge Intervals #56", "Insert Interval #57", "Non-overlapping Intervals #435", "Meeting Rooms II #253"]
    },
    {
        name: "Prefix Sum", icon: "∑", complexity: "O(n) build, O(1) query", when: "You need to answer multiple range sum queries, find subarrays with a given sum, or compute cumulative totals. Any time you see 'sum of subarray' — think prefix sum.",
        howItWorks: "Build a prefix array where prefix[i] = sum of elements from index 0 to i-1. Then the sum of any subarray [i..j] = prefix[j+1] - prefix[i]. One-time O(n) preprocessing enables unlimited O(1) range queries.\n\nThe power move: combine prefix sum with a hash map. To find 'number of subarrays with sum K,' track prefix sums in a hash map. If (current_prefix - K) exists in the map, you've found a valid subarray.",
        analogy: "Your bank statement shows your running balance after each transaction. To find how much you spent between Tuesday and Friday, you don't re-add each transaction — you just subtract Tuesday's balance from Friday's balance. One subtraction instead of multiple additions.",
        problems: ["Subarray Sum Equals K #560", "Product of Array Except Self #238", "Range Sum Query #303", "Continuous Subarray Sum #523"]
    },
    {
        name: "Monotonic Stack", icon: "📈", complexity: "O(n)", when: "You need to find the next greater element, next smaller element, or solve problems about 'how far can I see' — daily temperatures, histogram rectangles, stock span.",
        howItWorks: "Maintain a stack that keeps elements in monotonically increasing (or decreasing) order. For each new element: pop everything from the stack that violates the monotonic order. Each popped element 'gets its answer' — the new element is their 'next greater.' Then push the new element. Every element is pushed and popped at most once → O(n) total.",
        analogy: "You're standing in a line of people of varying heights, looking to the right. For each person, the 'next taller person' is the first one they can see over everyone in between. The monotonic stack tracks the 'visible' people — when a taller person arrives, shorter people in front get their answer and leave the stack.",
        problems: ["Daily Temperatures #739", "Next Greater Element #496", "Largest Rectangle in Histogram #84", "Trapping Rain Water #42"]
    },
];

const PatternsDetailView = () => {
    const [expanded, setExpanded] = useState(null);
    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>Algorithmic Patterns</h2>
                <p style={{ fontFamily: "'Outfit'", fontSize: 16, color: T.textMuted, margin: 0, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>About 87% of coding interview questions are built around these core patterns. Master them, and new problems become familiar puzzles.</p>
            </div>
            {PATTERN_DETAILS.map((p, i) => (
                <div key={i} style={{ marginBottom: 16, background: "#FFF", borderRadius: 16, border: `1px solid ${expanded === i ? T.rose : T.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                    <button onClick={() => setExpanded(expanded === i ? null : i)} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "20px 24px",
                        border: "none", background: "none", cursor: "pointer", textAlign: "left",
                    }}>
                        <span style={{ fontSize: 28 }}>{p.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700, color: T.text }}>{p.name}</div>
                            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: T.textLight, marginTop: 2 }}>{p.complexity}</div>
                        </div>
                        <span style={{ fontFamily: "'Outfit'", fontSize: 22, color: T.rose, transition: "transform 0.2s", transform: expanded === i ? "rotate(45deg)" : "none" }}>+</span>
                    </button>
                    {expanded === i && (
                        <div style={{ padding: "0 24px 24px" }}>
                            <div style={{ padding: 20, background: T.roseMist, borderRadius: 12, marginBottom: 16 }}>
                                <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: T.rose, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>When to use</div>
                                <p style={{ fontFamily: "'Outfit'", fontSize: 15, lineHeight: 1.75, color: "#333", margin: 0 }}>{p.when}</p>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>How it works</div>
                                {p.howItWorks.split("\n\n").map((para, j) => <p key={j} style={{ fontFamily: "'Outfit'", fontSize: 15, lineHeight: 1.75, color: "#333", margin: "0 0 10px" }}>{para}</p>)}
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: T.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Real-world analogy</div>
                                <p style={{ fontFamily: "'Playfair Display'", fontSize: 16, lineHeight: 1.75, color: "#444", margin: 0, fontStyle: "italic" }}>{p.analogy}</p>
                            </div>
                            <div>
                                <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: T.roseDark, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Practice problems</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {p.problems.map((prob, k) => <span key={k} style={{ padding: "4px 12px", borderRadius: 20, background: T.rosePale, fontFamily: "'JetBrains Mono'", fontSize: 12, color: T.roseDark }}>{prob}</span>)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─── COMPLEXITY VIEW ───────────────────────────────────────────────────────

const ComplexityView2 = () => {
    const [n, setN] = useState(40);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const curves = [
        { name: "O(1)", color: T.green, fn: () => 1, desc: "Array access, hash lookup" },
        { name: "O(log n)", color: T.blue, fn: n => Math.log2(Math.max(n, 1)), desc: "Binary search" },
        { name: "O(n)", color: "#9B59B6", fn: n => n, desc: "Linear scan, single loop" },
        { name: "O(n log n)", color: T.orange, fn: n => n * Math.log2(Math.max(n, 1)), desc: "Sorting (merge, quick, Tim)" },
        { name: "O(n²)", color: T.rose, fn: n => n * n, desc: "Nested loops, brute force pairs" },
        { name: "O(2ⁿ)", color: T.roseDark, fn: n => Math.pow(2, Math.min(n, 22)), desc: "Subsets, naive recursion" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = 2;
        const W = canvas.offsetWidth * dpr;
        const H = canvas.offsetHeight * dpr;
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        const w = W / dpr, h = H / dpr;
        ctx.clearRect(0, 0, w, h);

        const pad = { t: 20, r: 20, b: 40, l: 50 };
        const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
        const maxY = Math.max(...curves.map(c => c.fn(n)));
        const yS = maxY > 0 ? ph / maxY : 1;
        const xS = pw / Math.max(n, 1);

        ctx.strokeStyle = "#F0ECF0"; ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) { const y = pad.t + (ph / 4) * i; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke(); }
        for (let i = 0; i <= 4; i++) { const x = pad.l + (pw / 4) * i; ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, h - pad.b); ctx.stroke(); }

        ctx.fillStyle = T.textLight; ctx.font = "11px Outfit"; ctx.textAlign = "center";
        ctx.fillText(`n = ${n}`, pad.l + pw / 2, h - 6);

        curves.forEach(c => {
            ctx.strokeStyle = c.color; ctx.lineWidth = 2.5; ctx.beginPath();
            for (let x = 1; x <= n; x++) {
                const px = pad.l + x * xS;
                const val = Math.min(c.fn(x), maxY);
                const py = pad.t + ph - val * yS;
                x === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.stroke();
        });
    }, [n]);

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>Big O Complexity</h2>
                <p style={{ fontFamily: "'Outfit'", fontSize: 16, color: T.textMuted, margin: 0 }}>How algorithm speed scales as input grows. Drag the slider to see the difference.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 600, color: T.text }}>Input size:</span>
                <input type="range" min={5} max={100} value={n} onChange={e => setN(+e.target.value)} style={{ flex: 1, accentColor: T.rose }} />
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, fontWeight: 700, color: T.rose, minWidth: 40 }}>{n}</span>
            </div>
            <div style={{ background: "#FFF", borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, marginBottom: 24 }}>
                <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {curves.map(c => {
                    const val = c.fn(n);
                    return (
                        <div key={c.name} style={{ padding: 18, borderRadius: 14, background: "#FFF", border: `1px solid ${T.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 4, background: c.color }} />
                                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 700, color: T.text }}>{c.name}</span>
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 26, fontWeight: 700, color: c.color, margin: "4px 0" }}>
                                {val > 1e12 ? "∞" : val > 1e6 ? `${(val / 1e6).toFixed(1)}M` : val > 1e3 ? `${(val / 1e3).toFixed(1)}K` : Math.round(val)}
                            </div>
                            <div style={{ fontFamily: "'Outfit'", fontSize: 13, color: T.textMuted }}>{c.desc}</div>
                            <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: T.textLight, marginTop: 4 }}>operations when n={n}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── SIMPLE SIMULATORS FOR NEW DS ──────────────────────────────────────────

const LinkedListSimulator = ({ initial }: { initial: any[] }) => {
    const [nodes, setNodes] = useState([...initial]);
    const [input, setInput] = useState("");
    const [log, setLog] = useState(["Linked list initialized."]);
    const addLog = m => setLog(p => [m, ...p].slice(0, 6));
    return (
        <div>
            <svg viewBox={`0 0 ${Math.max(nodes.length * 100 + 20, 200)} 60`} style={{ width: "100%", maxWidth: 650, display: "block" }}>
                {nodes.map((v, i) => (
                    <g key={i}>
                        <rect x={10 + i * 100} y={10} width={60} height={36} rx={8} fill="#FFF" stroke={T.rose} strokeWidth={1.5} />
                        <text x={40 + i * 100} y={34} textAnchor="middle" fontSize={15} fontWeight={700} fontFamily="'JetBrains Mono'" fill={T.text}>{v}</text>
                        {i < nodes.length - 1 && <line x1={72 + i * 100} y1={28} x2={108 + i * 100} y2={28} stroke={T.roseLight} strokeWidth={2} markerEnd="url(#arrLL)" />}
                    </g>
                ))}
                {nodes.length > 0 && <text x={10 + nodes.length * 100 - 20} y={34} fontSize={11} fontFamily="'Outfit'" fill={T.textLight}>→ None</text>}
                <defs><marker id="arrLL" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={T.roseLight} /></marker></defs>
            </svg>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Value..." style={{ padding: "8px 12px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 14, width: 100, background: "#FFF" }} />
                <Btn label="Add to Head" onClick={() => { const v = parseInt(input); if (!isNaN(v)) { setNodes(p => [v, ...p]); addLog(`Inserted ${v} at head. O(1) — just pointer change.`); setInput(""); } }} />
                <Btn label="Add to Tail" variant="outline" onClick={() => { const v = parseInt(input); if (!isNaN(v)) { setNodes(p => [...p, v]); addLog(`Appended ${v} at tail. O(1) with tail pointer.`); setInput(""); } }} />
                <Btn label="Remove Head" variant="outline" onClick={() => { if (!nodes.length) return; addLog(`Removed head (${nodes[0]}). O(1).`); setNodes(p => p.slice(1)); }} />
                <Btn label="Reverse" variant="outline" onClick={() => { setNodes(p => [...p].reverse()); addLog(`Reversed list. O(n) — flip all pointers.`); }} />
            </div>
            <div style={{ marginTop: 12, padding: 12, background: T.roseMist, borderRadius: 10, maxHeight: 100, overflow: "auto" }}>
                {log.map((l, i) => <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: i === 0 ? T.roseDark : T.textMuted, padding: "2px 0", opacity: i === 0 ? 1 : 0.5 }}>{i === 0 && "→ "}{l}</div>)}
            </div>
        </div>
    );
};

const QueueSimulator = ({ initial }: { initial: any[] }) => {
    const [q, setQ] = useState([...initial]);
    const [input, setInput] = useState("");
    const [log, setLog] = useState(["Queue initialized."]);
    const addLog = m => setLog(p => [m, ...p].slice(0, 6));
    return (
        <div>
            <svg viewBox={`0 0 ${Math.max(q.length * 72 + 80, 200)} 70`} style={{ width: "100%", maxWidth: 600, display: "block" }}>
                <text x={4} y={38} fontSize={11} fontFamily="'Outfit'" fill={T.green} fontWeight={700}>OUT →</text>
                {q.map((v, i) => (
                    <g key={i}>
                        <rect x={50 + i * 72} y={14} width={60} height={40} rx={8} fill={i === 0 ? T.blue : "#FFF"} stroke={i === 0 ? "#2554A0" : T.border} strokeWidth={1.5} />
                        <text x={80 + i * 72} y={40} textAnchor="middle" fontSize={16} fontWeight={700} fontFamily="'JetBrains Mono'" fill={i === 0 ? "#FFF" : T.text}>{v}</text>
                    </g>
                ))}
                <text x={56 + q.length * 72} y={38} fontSize={11} fontFamily="'Outfit'" fill={T.rose} fontWeight={700}>← IN</text>
            </svg>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Value..." style={{ padding: "8px 12px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 14, width: 100, background: "#FFF" }} />
                <Btn label="Enqueue" onClick={() => { const v = parseInt(input); if (!isNaN(v)) { setQ(p => [...p, v]); addLog(`Enqueued ${v} at back. O(1).`); setInput(""); } }} />
                <Btn label="Dequeue" variant="outline" onClick={() => { if (!q.length) return; addLog(`Dequeued ${q[0]} from front. O(1) with deque.`); setQ(p => p.slice(1)); }} />
            </div>
            <div style={{ marginTop: 12, padding: 12, background: T.roseMist, borderRadius: 10, maxHeight: 80, overflow: "auto" }}>
                {log.map((l, i) => <div key={i} style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: i === 0 ? T.roseDark : T.textMuted, padding: "2px 0", opacity: i === 0 ? 1 : 0.5 }}>{i === 0 && "→ "}{l}</div>)}
            </div>
        </div>
    );
};

const GenericSimulator = ({ type, initial }: { type: string, initial: any[] }) => {
    const [log] = useState([`${type} visualization — interact with the concepts above to understand how data flows.`]);
    return (
        <div style={{ padding: 20, background: T.roseMist, borderRadius: 12, textAlign: "center" }}>
            <p style={{ fontFamily: "'Outfit'", fontSize: 14, color: T.textMuted }}>Interactive {type} simulator — explore the operations described above to build your mental model.</p>
        </div>
    );
};

// ─── COMPARE VIEW ──────────────────────────────────────────────────────────

const COMPARE_DS = {
    "Array": { access: "O(1)", search: "O(n)", insertEnd: "O(1)", insertMid: "O(n)", deleteMid: "O(n)", space: "Compact", cache: "Excellent", ordered: "Yes", python: "list" },
    "Linked List": { access: "O(n)", search: "O(n)", insertEnd: "O(1)", insertMid: "O(1)*", deleteMid: "O(1)*", space: "Pointer overhead", cache: "Poor", ordered: "Yes", python: "deque" },
    "Hash Table": { access: "—", search: "O(1) avg", insertEnd: "O(1) avg", insertMid: "—", deleteMid: "O(1) avg", space: "~2× overhead", cache: "Moderate", ordered: "No†", python: "dict / set" },
    "Stack": { access: "Top only", search: "O(n)", insertEnd: "O(1)", insertMid: "—", deleteMid: "—", space: "Compact", cache: "Good", ordered: "LIFO", python: "list" },
    "Queue": { access: "Front only", search: "O(n)", insertEnd: "O(1)", insertMid: "—", deleteMid: "—", space: "Compact", cache: "Good", ordered: "FIFO", python: "deque" },
    "BST (balanced)": { access: "O(log n)", search: "O(log n)", insertEnd: "O(log n)", insertMid: "O(log n)", deleteMid: "O(log n)", space: "Pointer overhead", cache: "Moderate", ordered: "Yes (in-order)", python: "SortedContainers" },
    "Heap": { access: "Min/Max O(1)", search: "O(n)", insertEnd: "O(log n)", insertMid: "—", deleteMid: "O(log n)", space: "Compact (array)", cache: "Good", ordered: "Partial", python: "heapq" },
    "Graph": { access: "—", search: "O(V+E)", insertEnd: "O(1)", insertMid: "O(1)", deleteMid: "O(degree)", space: "O(V+E)", cache: "Varies", ordered: "No", python: "dict of lists" },
};

const CompareView = () => {
    const names = Object.keys(COMPARE_DS);
    const [left, setLeft] = useState("Array");
    const [right, setRight] = useState("Hash Table");
    const fields = ["access", "search", "insertEnd", "insertMid", "deleteMid", "space", "cache", "ordered", "python"];
    const labels = { access: "Access by Index/Key", search: "Search", insertEnd: "Insert (end)", insertMid: "Insert (middle)", deleteMid: "Delete (middle)", space: "Memory", cache: "Cache Locality", ordered: "Ordered?", python: "Python Built-in" };
    const L = COMPARE_DS[left], R = COMPARE_DS[right];

    const Sel = ({ value, onChange }) => (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontFamily: "'Outfit'", fontSize: 14, fontWeight: 600, background: "#FFF", color: T.text, flex: 1, cursor: "pointer" }}>
            {names.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
    );

    const colorize = (val) => {
        if (!val) return T.textLight;
        if (val.includes("O(1)") && !val.includes("n")) return T.green;
        if (val.includes("log")) return T.blue;
        if (val.includes("O(n)") || val.includes("O(V")) return T.orange;
        if (val === "—") return T.textLight;
        return T.text;
    };

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>Compare Data Structures</h2>
                <p style={{ fontFamily: "'Outfit'", fontSize: 16, color: T.textMuted }}>Select any two structures to see a detailed side-by-side comparison.</p>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 28 }}>
                <Sel value={left} onChange={setLeft} />
                <span style={{ fontFamily: "'Playfair Display'", fontSize: 22, color: T.rose, fontWeight: 700, fontStyle: "italic" }}>vs</span>
                <Sel value={right} onChange={setRight} />
            </div>

            <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", background: T.roseDark, color: "#FFF" }}>
                    <div style={{ padding: "14px 18px", fontFamily: "'Outfit'", fontSize: 13, fontWeight: 700 }}>Aspect</div>
                    <div style={{ padding: "14px 18px", fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, borderLeft: "1px solid rgba(255,255,255,0.15)" }}>{left}</div>
                    <div style={{ padding: "14px 18px", fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, borderLeft: "1px solid rgba(255,255,255,0.15)" }}>{right}</div>
                </div>
                {fields.map((f, i) => (
                    <div key={f} style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", background: i % 2 === 0 ? "#FFF" : T.offWhite, borderTop: `1px solid ${T.border}` }}>
                        <div style={{ padding: "12px 18px", fontFamily: "'Outfit'", fontSize: 13, fontWeight: 600, color: T.textMuted }}>{labels[f]}</div>
                        <div style={{ padding: "12px 18px", fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600, color: colorize(L[f]), borderLeft: `1px solid ${T.border}` }}>{L[f]}</div>
                        <div style={{ padding: "12px 18px", fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600, color: colorize(R[f]), borderLeft: `1px solid ${T.border}` }}>{R[f]}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 12, fontFamily: "'Outfit'", fontSize: 12, color: T.textLight }}>
                * O(1) if you already have a reference to the node &nbsp;&nbsp; † Python dicts preserve insertion order since 3.7
            </div>
        </div>
    );
};

// ─── PIPELINE VIEW ─────────────────────────────────────────────────────────

const PIPELINE = [
    { constraint: "n ≤ 10", complexity: "O(n!) or O(2ⁿ)", patterns: "Backtracking, brute-force permutations", color: T.green },
    { constraint: "n ≤ 20", complexity: "O(2ⁿ)", patterns: "Bitmask DP, backtracking with pruning", color: T.green },
    { constraint: "n ≤ 100", complexity: "O(n³)", patterns: "Floyd-Warshall, triple nested loops", color: T.blue },
    { constraint: "n ≤ 1,000", complexity: "O(n²)", patterns: "2D DP, two nested loops, bubble/selection sort", color: T.blue },
    { constraint: "n ≤ 10,000", complexity: "O(n²) barely", patterns: "Two pointers, careful DP", color: T.orange },
    { constraint: "n ≤ 100,000", complexity: "O(n log n)", patterns: "Sort + binary search, merge sort, heap", color: T.orange },
    { constraint: "n ≤ 1,000,000", complexity: "O(n)", patterns: "Sliding window, prefix sum, hash map, single pass", color: T.rose },
    { constraint: "n > 10,000,000", complexity: "O(log n) or O(1)", patterns: "Binary search, math formula, hash lookup", color: T.roseDark },
];

const PipelineView = () => (
    <div>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>Constraint → Pattern Pipeline</h2>
            <p style={{ fontFamily: "'Outfit'", fontSize: 16, color: T.textMuted, maxWidth: 600, margin: "0 auto" }}>Read the problem constraints FIRST. The input size tells you the expected complexity. The complexity narrows your pattern choices.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PIPELINE.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 150px 1fr", background: "#FFF", borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden", transition: "box-shadow 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${row.color}20`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                    <div style={{ padding: "16px 18px", fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: row.color, background: `${row.color}08` }}>{row.constraint}</div>
                    <div style={{ padding: "16px 18px", fontFamily: "'JetBrains Mono'", fontSize: 13, color: T.text, borderLeft: `1px solid ${T.border}` }}>{row.complexity}</div>
                    <div style={{ padding: "16px 18px", fontFamily: "'Outfit'", fontSize: 14, color: T.textMuted, borderLeft: `1px solid ${T.border}` }}>{row.patterns}</div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: 28, background: "#FFF", borderRadius: 16, padding: 24, border: `1px solid ${T.border}` }}>
            <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700, color: T.rose, margin: "0 0 14px" }}>How to Use This</h3>
            <div style={{ fontFamily: "'Outfit'", fontSize: 15, lineHeight: 1.85, color: "#444" }}>
                <strong style={{ color: T.roseDark }}>Step 1:</strong> Read the problem's constraint section. Look for something like "1 ≤ n ≤ 10⁵" — that means n can be up to 100,000.<br /><br />
                <strong style={{ color: T.roseDark }}>Step 2:</strong> Find the matching row above. 100,000 → you need O(n log n) or better.<br /><br />
                <strong style={{ color: T.roseDark }}>Step 3:</strong> The pattern column narrows your options: sorting + binary search, heap, or merge-based approaches.<br /><br />
                <strong style={{ color: T.roseDark }}>Step 4:</strong> Match the problem description to the specific pattern. "Contiguous subarray" → sliding window. "Shortest path" → BFS. "Sorted + pair sum" → two pointers.<br /><br />
                This pipeline turns an overwhelming 2500+ problem set into a manageable decision tree.
            </div>
        </div>
    </div>
);

// ─── MAIN APP ──────────────────────────────────────────────────────────────

export default function DSABook() {
    const [section, setSection] = useState("chapters");
    const [chapterIdx, setChapterIdx] = useState(0);

    return (
        <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', sans-serif" }}>
            <style>{FONTS}</style>
            <style>{`
        * { box-sizing: border-box; margin: 0; }
        ::selection { background: ${T.rosePale}; color: ${T.roseDark}; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: ${T.rosePale}; border-radius: 3px; }
        button:focus-visible { outline: 2px solid ${T.rose}; outline-offset: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

            {/* Header */}
            <header style={{ padding: "40px 24px 0", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: T.rose, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>The Complete Guide</div>
                <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 48, fontWeight: 800, color: T.text, margin: "0 0 8px", letterSpacing: -1, lineHeight: 1.1 }}>
                    Data Structures<br />&amp; Algorithms
                </h1>
                <p style={{ fontFamily: "'Playfair Display'", fontSize: 18, color: T.textMuted, fontStyle: "italic", margin: "0 0 32px" }}>
                    A Digital Simulation Book — From History to Code
                </p>
            </header>

            {/* Navigation */}
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
                <TopNav section={section} setSection={setSection} />
            </div>

            {/* Content */}
            <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", animation: "fadeUp 0.4s ease-out" }} key={section}>
                {section === "chapters" && (
                    <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
                            {CHAPTERS.map((ch, i) => (
                                <button key={ch.id} onClick={() => setChapterIdx(i)} style={{
                                    padding: "10px 20px", border: chapterIdx === i ? `2px solid ${T.rose}` : `1.5px solid ${T.border}`,
                                    borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit'", fontSize: 14, fontWeight: 600,
                                    background: chapterIdx === i ? T.rose : "#FFF",
                                    color: chapterIdx === i ? "#FFF" : T.text,
                                    transition: "all 0.15s",
                                }}>{ch.icon} {ch.name}</button>
                            ))}
                        </div>
                        <Chapter ch={CHAPTERS[chapterIdx]} />
                    </div>
                )}
                {section === "timeline" && <TimelineView />}
                {section === "compare" && <CompareView />}
                {section === "patterns" && <PatternsDetailView />}
                {section === "pipeline" && <PipelineView />}
                {section === "complexity" && <ComplexityView2 />}
            </main>

            <footer style={{ textAlign: "center", padding: "32px 24px", borderTop: `1px solid ${T.border}` }}>
                <p style={{ fontFamily: "'Playfair Display'", fontSize: 15, color: T.textLight, fontStyle: "italic" }}>
                    Every data structure is a tradeoff. Every algorithm is a strategy. Every problem is a pattern waiting to be recognized.
                </p>
            </footer>
        </div>
    );
}