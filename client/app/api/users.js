import { client, getAllUsers } from "@utils";

export const GET = async (request) => {
  try {
    const users = await client.fetch(getAllUsers());
    console.log(users);
    return new Response(JSON.stringify(users));
  } catch (err) {
    return new Response("Faild to fetch users", { status: 500 });
  }
};
