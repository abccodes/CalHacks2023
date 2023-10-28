import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const listNumbers = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const numbers = await ctx.db.query("numbers").take(args.count);
    return {
      viewer: JSON.stringify(await ctx.auth.getUserIdentity()),
      numbers: numbers.map((number) => number.value),
      user: await ctx.auth.getUserIdentity(),
    };
  },
});

// You can write data to the database via a mutation:
export const addNumber = mutation({
  // Validators for arguments.
  args: {
    value: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.

    const id = await ctx.db.insert("numbers", { value: args.value });

    console.log("Added new document with id:", id);
    // Optionally, return a value from your mutation.
    // return id;
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Action implementation.
  handler: async (ctx, args) => {
    //// Use the browser-like `fetch` API to send HTTP requests.
    //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    // const response = await ctx.fetch("https://api.thirdpartyservice.com");
    // const data = await response.json();

    //// Query data by running Convex queries.
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    //// Write data by running Convex mutations.
    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});
// add a new user to convex database once logged in
export const addUser = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    const userQuery = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("id"), user?.subject))
      .take(1);

    if (userQuery.length === 0 && user) {
      console.log("New user added to table");
      const taskId = await ctx.db.insert("users", {
        name: user.name,
        email: user.email,
        id: user.subject,
      });
    } else {
      console.log("no user added to table");
    }
  },
});

function generateRandomID() {
  return Math.floor(Math.random() * 10000000000); // 10 digits
}
// create a new group, add an array of user ids to the group
export const createNewGroup = mutation({
  args: {
    name: v.string(),
    id: v.number(),
    groupMembers: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    // const userQuery = await ctx.db
    //   .query("users")
    //   .filter((q) => q.eq(q.field("id"), user?.subject))
    //   .take(1);

    if (user) {
      const randomID = generateRandomID();

      const taskId = await ctx.db.insert("groups", {
        name: args.name,
        id: randomID,
        groupMembers: [],
      });
      console.log("Task id: ", taskId);
    }
  },
});

// not working yet:
// create a new group, add an array of user ids to the group
export const getAllGroupsForUser = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    // const userQuery = await ctx.db
    //   .query("users")
    //   .filter((q) => q.eq(q.field("id"), user?.subject))
    //   .take(1);
    console.log("user", user);
    const groups = await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("groupMembers"), [user?.subject]))
      .take(50);

    console.log("Groups: ", groups);
  },
});
