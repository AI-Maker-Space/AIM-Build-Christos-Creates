import chainlit as cl
from extract_app import extract_information


@cl.on_chat_start
async def start():
    """
    This is called when the Chainlit chat is started!
    """
    cl.user_session.set("chain", extract_information())
    await cl.Message("Welcome to the information extraction chat!").send()

@cl.on_message
async def main(message: cl.Message):
    """
    This is called when a message is received!
    """
    chain = cl.user_session.get("chain")
    res = await chain.ainvoke({"input": message})
    res = res["text"]
    out = "Name \tAge\n" + ''.join(
        [f"{person.name}\t{person.age}\n" for person in res]
    )
    await cl.Message(content=out).send()