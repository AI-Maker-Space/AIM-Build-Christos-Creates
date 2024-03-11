# Creating A Custom GPT Through OpenAI

We'll create a [CustomGPT](https://openai.com/blog/introducing-gpts) for today's assignment through the OpenAI user interface. 

## 🏗️Build

### Create a Custom GPT

<details open>
<summary>Creating a Basic GPT</summary>
  <br>
  
  The first step will be to navigate to [this](https://chat.openai.com/gpts) weblink. 
  > NOTE: You'll need to ensure you're signed into your OpenAI Account!

  Once you're there - you'll want to click on the green "+ Create" button in the top left of your screen, as shown below:
  ![image](https://i.imgur.com/784DUbN.png)

  > NOTE: From here, you could use the interactive `GPT Builder` to create your GPT - but we'll be looking at the `Configure` settings in the instructions below.

  Now that we have a draft of our new GPT - let's customize it to do what we want!
  
  ---

  1. Navigate to the `Configure` tab of the builder UI.

  ![image](https://i.imgur.com/Io61eeQ.png)

  2. Now we can fill out the available fields. Here is a sample of a completed form:

  ![image](https://i.imgur.com/rHRB2S1.png)

  > NOTE: For this example, we have disabled DALL-E Image Generation and Code Interpreter - we'll talk more about those in a second.

  3. Now that we have our GPT set up, let's go ahead and Save it. You can do so using the green "Save" button in the top left of the UI.

  ![image](https://i.imgur.com/i86D6X6.png)

  > NOTE: We're setting "Publish to" to "Everyone" so we can share our GPT. People using our GPT will be charged based on their usage - we will not be charged for their usage.
  
  4. Once you save your GPT - you should see a "Published!" widget where you can find the link to your GPT! Keep track of that link, as it's what you'll be submitting for your assignment!

  5. At this point, there's nothing left to do but try your GPT out! 🎉
  
</details>

<details open>
<summary>Adding RAG to your GPT</summary>
  <br>
  
  Now that we have a basic GPT - we can add documents to it so it can be leveraged for RAG! 

  > NOTE: While you don't have to program the specific components of RAG - under the hood the same processes are being handled by OpenAI. From splitting/chunking to retrieval!

  Let's look a the few changes we have to make to allow this GPT to be a RAG. 

  1. The first part of the form can remain the same - provide a name, a logo, and an informative description.

  ![image](https://i.imgur.com/srsQ1Lk.png)

  2. The next part of the form is where we provide instructions on which queries to respond to, and which to not respond to (or in this case, generate a very specific response)

  ![image](https://i.imgur.com/CjAg5hM.png)

  3. After that we can associate our GPT with specific data files. We're providing a `.csv` file concerning emissions, located [here](https://www.stats.govt.nz/large-datasets/csv-files-for-download/) - as well as New Zealand's [Wikipedia page](https://en.wikipedia.org/wiki/New_Zealand).

  ![image](https://i.imgur.com/8m83IB4.png)

  > NOTE: Notice how the `.csv` file is only available to the Code Interpreter. This is because the Code Interpreter can, among other things, execute code leveraging - as an example - the Pandas Python library - to interact with our data and answer questions about it.
  
  4. Now we will need to give our GPT access to both the DALL-E image generation (to accommodate our "I don't know" answer) and Code Interpreter (for our `.csv` file).

  ![image](https://i.imgur.com/arUMMHI.png)

  5. With that, we're almost done - we'll also want to be aware of the following "Additional Settings", where you can opt-out of letting the conversational data generated be used by OpenAI to improve their models.

  ![image](https://i.imgur.com/VEciUKB.png)

  6. Now we can see how our GPT behaves with various questions! 

  Example Analysis:
  
  ![image](https://i.imgur.com/zmTkxLl.png)

  > NOTE: To see the full analysis, simply click on the dropdown arrow.

  Example "No" Response: 
  
  ![image](https://i.imgur.com/jV3CXNc.png)
  
</details>

### Record a Loom Walkthrough:

Create a 5min. (maximum) Loom Video walking through your Custom GPT!

## Ship 🚢

Ship the custom GPTs to us!

Provide a URL to your custom GPT and your loom video walkthrough!

## Share 🚀

Share about your experience in a LinkedIn post and/or in the Discord!

* [AIM Discord: #build-ship-share](https://discord.com/channels/1135695983720792216/1135700320517890131)
* [LinkedIn](https://www.linkedin.com/company/ai-maker-space/) (tag @AI Makerspace)

## Author ✍🏻
written by [The Wiz 🧙🏻‍♂️](https://www.linkedin.com/in/csalexiuk/)
