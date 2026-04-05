export interface PodcastEpisode {
  id: string;
  number: number;
  title: string;
  description: string;
  level?: string;
  transcript?: string;
  audioUrl?: string;
}

export interface PodcastSeries {
  id: string;
  name: string;
  description: string;
  source: string;
  episodes: PodcastEpisode[];
}

export const podcastSeries: PodcastSeries[] = [
  {
    id: 'british-council-s1',
    name: 'LearnEnglish Podcasts — Series 1',
    description: 'Elementary podcasts from the British Council. Tess and Ravi discuss everyday topics with guests, while Carolina shares her adventures as a student in the UK.',
    source: 'British Council',
    episodes: [
      {
        id: 'bc-s1-e01',
        number: 1,
        title: 'Welcome to LearnEnglish Podcasts',
        description: 'Tess and Ravi introduce themselves, and their guests talk about Angelina Jolie, New York City and celebrities who work for charity.',
        level: 'A2',
        audioUrl: 'https://learnenglish.britishcouncil.org/sites/podcasts/files/podcast/elementary-podcasts-s01-e01.mp3',
        transcript: `Section 1 - "Susan, this is Paul" – introducing your friends

Ravi: Hello, and welcome to LearnEnglish elementary podcast number one. My name's Ravi…

Tess: … and I'm Tess. We're your presenters and we've got lots of things for you to listen to today, but before we start, I think we should introduce ourselves. Ravi?

Ravi: OK … erm … I'm Ravi.

Tess: Or, I tell you what, I'll introduce you and you can introduce me. How about that?

Ravi: Well, OK then. Erm, this is Tess. She's from London. She's … how old are you?

Tess: None of your business, Ravi!

Ravi: And she loves dancing and riding her mountain bike. OK?

Tess: OK. And this is Ravi. He comes from Manchester. He's 23. Oh … aren't you?

Ravi: Oh yes.

Tess: He likes football, and … he's a great cook.

Ravi: Thanks! And there's one more person for you to meet. I'd like to introduce our producer, Gordon. Say hello to everyone Gordon!

Gordon: Hello! Pleased to meet you!

Ravi and Tess: Hi Gordon

Tess: And how are you today?

Gordon: Very well thank you Tess.

Section 2: I'd like to meet

Tess: Good! We'll speak to Gordon again later in the show but now it's time to get on with our programme. We've got an excellent show for you today, and let's start with our first section, called 'I'd like to meet'. We ask people a simple question – which famous person, dead or alive would you like to meet? And of course, we ask them to explain why. Our guest today on 'I'd like to meet' is Zara Heller from Bristol. Hello Zara and welcome to the show.

Zara: Hello.

Ravi: Hi Zara.

Tess: And what do you do Zara?

Zara: I'm a student, I'm in my last year at school, I'm 16.

Tess: Right. Now let's ask the question. So Zara, which famous person, dead or alive would you like to meet?

Zara: I'd like to meet Angelina Jolie.

Ravi: Angelina Jolie. Great - good choice! Tell us a bit about her.

Zara: She's an American film actress, she was in 'Tomb Raider', and she's an ambassador for the United Nations too.

Tess: And why did you choose her to talk about today?

Zara: Well, because I really admire her. She's a famous film star with a lot of money and a famous celebrity film star husband, but she really cares about helping people and she uses her money and her fame to help children and people who are very poor or have a difficult life. I saw a film about her on MTV the music channel – it was a video diary of her visiting Africa and talking about how to stop poverty, and they were really simple things, and I thought it was really cool because MTV doesn't usually show programmes like that, it's usually just music videos and things, but because she's famous and beautiful then people want to see her so she can get a lot of attention for the things that she wants to change.

Tess: Do you like her films? Do you think she's a good actress?

Zara: Yes I do. I don't think she's a great actress, but she's a good actress, and she's so beautiful that you just want to look at her all the time.

Ravi: Yeah.

Zara: I think she's one of the most beautiful women in the world. I love watching her, I love all her films.

Ravi: And what would you like to talk to her about Zara?

Zara: I'd like to talk about her trips to different places all around the world, and about Hollywood, and her family and about what people like me can do to help poor children.

Tess: Well thank you very much Zara. That was really interesting. Personally, I'd like to talk to her about her husband, Brad Pitt. I think he's gorgeous.

Ravi: OK Tess, calm down. Erm, for all of you listening, we'd like to hear from you. Which famous person, dead or alive, would you like to meet? And why? Email us at learnenglishpodcast@britishcouncil.org, that's learnenglishpodcast - all one word – AT - britishcouncil – all one word DOT org, that's o-r-g. Let us know which famous person you would like to meet and why.

Section 3: Quiz

Tess: OK. Now it's quiz time. Every week we'll have a little quiz to get you thinking. This week it's the ten second quiz. It's very easy. We give you a topic and you give as many answers as you can - in 10 seconds. Our two players today are Daniel – Daniel's 16 and comes from London. Hello Daniel.

Daniel: Hi

Tess: And Alice – Alice is also 16 and she comes from Liverpool. Hi Alice.

Alice: Hello

Tess: Do you both know what to do? OK. We give you a topic, and you have to write down all the words you can think of. For example, we say 'bathroom', and you write a list, bath, soap, shampoo, and so on. As quick as you can. Got the idea?

Alice: Yeah

Tess: Good. Okay. Let's play. You've got ten seconds to write down … things you can find in a kitchen. OK? So, for example you could say 'microwave oven'. OK? Things you can find in a kitchen. Go! OK, Daniel. How many?

Daniel: Erm, five, Tess.

Tess: How about you, Alice?

Alice: Erm, seven, I think.

Tess: OK, let's hear your seven words, Alice. Things you find in a kitchen.

Alice: Erm, fridge. Cooker. Pans. Plates. Knife, fork, spoon.

Tess: That's seven. Well done, Alice. How many did you get, Ravi?

Ravi: Oh, the clock makes me nervous – I can't think when the clock's ticking like that. Maybe the question next week will be about football.

Tess: Thanks Daniel, thanks Alice. And if any of you listening have a good game we can play in quiz time, write to us and let us know. The address is learnenglishpodcast@britishcouncil.org. We'd love to hear your ideas for games we can play. What's next, Ravi?

Section 4: Our person in...

Ravi: The next part of the show is called 'Our person in'. We'll listen to people in interesting places all over the world telling us something about life in the country they're in. Today, we'll hear from Mike Southern. Mike is … Our man in New York.

Mike: New York. What do you think of? Skyscrapers. Taxis. Noise. People. John Lennon said that New York is the capital city of the world – and it certainly feels that way.

But in the centre of this exciting, noisy, polluted city there is a place to find peace and quiet. A short walk from busy Fifth Avenue in Manhattan you'll find Central Park. Central Park is the green heart of New York City and over 25 million people come here each year to escape the city. People run, swim, climb or simply sit and read a book in the huge park's different scenery. And it's not just for people. Lots of rare birds have made their home in the park and there are legends of big cats hiding in the dark trees.

Although it looks completely natural, the park is man made, created over 150 years ago. Frederick Law Olmsted and Calvert Vaux designed the park at a time when the city was a very crowded, dirty and unhealthy place to live. They wanted to make a place where rich and poor people could find fresh air in the dirty city.

It does the same job today. As a friend of mine always tells me, "Life in New York would be impossible without Central Park"

Tess: Wow! Really interesting. We'll hear from another one of our people next time. Or if you'd like to write in and tell us something interesting about your city or town, we'd love to hear from you. You can send it to us at learnenglishpodcast@britishcouncil.org

Section 5: Your turn

Tess: Now we're going out into the street to listen to 'Your Turn'

Ravi: In this part of the show, we go out into the street to find out what people think about our question of the day. And today we're going to ask a question about celebrities - like film stars, actors, singers – who promote charities and ask people to give them money or aid. At the beginning of the show, we listened to Zara from Bristol talking about Angelina Jolie. Zara talked about Angelina Jolie's work for charity. And nowadays, lots of famous people – celebrities - do the same. But is it a good idea? So today's question is … 'Is it a good idea for celebrities to do work for charity?'

Tess: Hmm. 'Is it a good idea for celebrities to do work for charity?' Interesting question. Let's listen to the answers.

Voice 1: I think it's a good thing. People don't want to listen to boring politicians but everyone likes celebrities so they listen to what they have to say. When Bob Geldof and Bono organised Live8 a few years ago, everybody was talking about how to end poverty in Africa. My little brother was only twelve years old, but he was talking about it. That can't be bad.

Voice 2: I hate it. The celebrities only want publicity, and they want us to think that they're really nice people, you know, they care about the world, they care about poverty, so they can sell more records. But it's a big lie. They're not interested in poor people or the charities at all.

Voice 3: Why is it a problem? The charities need money, and if celebrities can help them to get more, then what's wrong with that? I think that some celebrities only want publicity, but, well, who cares! The charities get some money, that's the really important thing.

Voice 4: If you think for example, Angelina Jolie or George Clooney is really cool, then you want to do the same things that they do. So you might give to charity too because you want to copy your favourite star. I think it's a good thing. Helping people is cool nowadays.

Voice 5: I think the celebrities do it because they copy other celebrities. Everyone's doing it nowadays – it's the fashion to do work for charity. I hate it. These film stars make millions of dollars for a film and live in houses that cost millions of dollars, and travel in private planes and stay in expensive hotels. And then they go and visit some 'poor people'. It's ridiculous.

Ravi: OK, some interesting answers there.

Tess: Hmm. Do you have an opinion about this question? We'd love to know what you think. 'Is it a good idea for celebrities to do work for charity?' Or do you have an idea for a question that we could ask on Your Turn? Send us an email at learnenglishpodcast@britishcouncil.org - and we can take your question into the street.

Section 6: Carolina

Ravi: OK. Now – it's time to meet Carolina. Carolina is from Venezuela and she's visiting Britain for the first time. It's a big adventure for her – she's going to live, study and she hopes, have a good time here in the UK – and we're going with her!

Tess: Carolina's going to study in Newcastle in the north-east of England. She speaks very good English but this is her first visit to Britain, so some things are very strange for her. We're going to follow Carolina in our podcasts and listen to some of the conversations that she has in lots of different situations. Today we're going to hear what happened when she first arrived in Britain from Venezuela. Here's Carolina at Heathrow airport in London. Let's listen to her conversation at Immigration Control.

Carolina: Excuse me. Am I in the right line for immigration?

Woman: Erm, I don't know dear. It depends. What nationality are you?

Carolina: Venezuelan.

Woman: No, no, this queue's for British and European Union members. You need to go … over there – where it says 'Other passport holders'. Can you see?

Carolina: Oh, yes, OK, thank you.

Immigration Officer: Good evening.

Carolina: Good evening.

Immigration Officer: Where have you travelled from today?

Carolina: From Venezuela, from Caracas.

Immigration Officer: Can I see your passport please? … Thank you. Is this your first visit to the UK?

Carolina: Yes it is.

Immigration Officer: And what are you going to do here?

Carolina: I'm a student. I'm going to study at the University of Newcastle.

Immigration Officer: Is it a full-time course or a part-time course?

Carolina: Erm, full-time, it's a full-time course.

Immigration Officer: Hmm.

Carolina: I've got my letter from the university here. Do you want to see it?

Immigration Officer: Yes please.

Carolina: Here you are.

Immigration Officer: Thank you. And how long is the course? How long do you intend to stay in the country?

Carolina: Three years.

Immigration Officer: Three years. Hmm.

Carolina: Yes, that's right.

Immigration Officer: Do you intend to work in this country?

Carolina: Oh, no, no, I'm not going to work, well maybe in the university holidays, but the British Embassy in Caracas said that was OK.

Immigration Officer: Yes, that's correct. Students can work in the holidays.

Carolina: Is everything OK?

Immigration Officer: Yes, everything seems to be in order. I just need to stamp your passport with today's date. Here you are. Passport and letter.

Carolina: Thank you.

Immigration Officer: I hope you enjoy your stay. Newcastle's a very nice place. Go down the stairs and turn left to collect your baggage.

Carolina: Thank you very much.

Immigration Officer: Good evening sir. And where have you travelled …

Section 7 - The joke

Ravi: Well, that's almost the end …

Tess: Wait a minute Ravi. Don't forget Gordon.

Ravi: Gordon? What do you mean?

Tess: He wants to tell a joke.

Ravi: Oh no

Tess: Don't be horrible. Gordon! Joke time! Come on Gordon! Are you ready?

Gordon: Yes, I'm here.

Ravi: I hope this is good Gordon.

Gordon: How long have I got?

Ravi: One minute – at the most.

Gordon: OK then. Erm, right. A chicken walks into a library…

Ravi: A chicken?

Gordon: Yeah. A chicken walks into a library, walks up to the counter and says to the librarian "Book, book". The librarian gives the chicken two books – she puts the books on the chicken's head – and the chicken walks out of the library.

One hour later, the chicken walks back into the library. It walks up to the counter and says to the librarian "Book, book". The librarian gives the chicken two books and the chicken walks out of the library.

An hour later, this happens again. "Book, book", and the chicken walks out of the library with two books on its head. But this time the librarian thinks, "Hmm, this is strange" so she decides to follow the chicken. She goes out of the library and follows the chicken. The chicken crosses the road, walks along the street, turns the corner, until it comes to the lake. Sitting by the lake is a big, fat frog. The chicken gives the books to the frog and the frog looks at them and says "Read it, Read it".

Tess: Oh Gordon, that's terrible.

Ravi: And that's the end of this part of the show. We have to go now but don't go away. After this little break you're going to hear Tom, our English teacher. After every show, Tom talks about the language you heard and gives you ideas to help you learn. So, don't go away, but we'll say goodbye now. See you next time.

Tess: Bye! Don't forget to send us your emails! Here's that address one more time. It's learnenglishpodcast@britishcouncil.org.

Tom the teacher

Tom: Hi, I'm Tom. At the end of every podcast you'll hear from me. I'm going to talk about some of the language you heard in the programmes and talk about ways to help you learn English. Remember Carolina in the airport? Listen to part of her conversation again.

Immigration Officer: Is this your first visit to the UK?

Carolina: Yes it is.

Immigration Officer: And what are you going to do here?

Carolina: I'm a student. I'm going to study at the University of Newcastle.

Tom: Carolina and the Immigration Officer are talking about the future – Carolina's time in Britain. To talk about the future they both use 'going to'. The Immigration Officer says "And what are you going to do here?" and Carolina says "I'm going to study at the University of Newcastle". They both used 'going to' to talk about the future because they are talking about plans. When the Immigration Officer says "What are you going to do here?" he's asking Carolina what her plan is. And she says "I'm going to study" because that's her plan – she decided it before she left Venezuela.

So, we use 'going to' to talk about future plans. But listen to another part of Carolina's conversation.

Immigration Officer: Thank you. And how long is the course? How long do you intend to stay in the country?

Carolina: Three years.

Immigration Officer: Three years. Hmm.

Carolina: Yes, that's right.

Immigration Officer: Do you intend to work in this country?

Carolina: Oh no, no, I'm not going to work, well maybe in the university holidays, but the British Embassy in Caracas said that was OK.

Tom: The Immigration Officer said "How long do you intend to stay in the country?" and "Do you intend to work in this country?" Again he was asking about Carolina's future plans – but he said "Do you intend". "Intend" is a formal way to talk or ask about plans. You might hear this verb, "intend", at an airport immigration desk or on an immigration form. It's another way to ask about your plans. One more thing. Did you notice that when Carolina arrived at the desk the Immigration Officer said "Good evening"? He didn't say "Goodnight". Do you know why not? We only say "goodnight" when we say goodbye or when we go to bed. When we meet someone after around 5 o'clock in the afternoon we say "Good evening" and we only say "goodnight" to people before we go home or before we go to bed.

OK. In another part of the show we heard Daniel and Alice playing a game. Listen to part of it again.

Tess: You've got ten seconds to write down things you can find in a kitchen. … OK, Daniel how many?

Daniel: Erm, five, Tess.

Tess: How about you, Alice?

Alice: Erm, seven, I think.

Tess: OK, let's hear your seven words, Alice. Things you find in a kitchen.

Alice: Erm fridge. Cooker. Pans. Plates. Knife, fork, spoon.

Tom: I hope all of you have a notebook where you keep new words – a vocabulary notebook. Think about how you put new words into your notebook. Do you put them in alphabetically? All the words beginning with 'A', then all the words beginning with 'B'? Or do you organise your new words another way? Some people put words into their notebooks in word families. They put words together that are connected in some way. For example, you could have a page in your vocabulary notebook called 'kitchen' and you could keep all the words from the game – fridge, cooker, pan – all of those words – on the 'kitchen' page of your notebook. You could have pages for, say, sports – 'football', 'tennis' 'bowling' and so on. And you can write more than just the words – you can write the verbs that go with the words – 'play' football but 'go' bowling or 'go' skiing. There's no right way or wrong way to keep your new vocabulary. You have to find the way that helps you remember the new words.

OK. Oh, erm, by the way, if there are any words from the game that you don't know remember that you can find them on the website. You can read all of the podcast and if you click on a word it'll take you to a dictionary that tells you what the word means. We'll give you that address again at the end – so go and find a pen to write it down!

Right, finally, after every podcast I'll try to show you something that you can try to use in your own English. This week I heard this interesting expression:

Carolina: Excuse me. Am I in the right line for immigration?

Woman: Erm, I don't know dear. It depends. What nationality are you?

Tom: Now. There are two things there I want to talk about. Firstly, the old lady called Carolina "dear" – she said "I don't know dear". Sometimes, older people might call you "dear". It's a friendly, affectionate thing to do. But be careful! It might sound a bit strange if you try to use it yourself.

The other thing I noticed was that the old lady said "It depends". She didn't know the answer because she needed more information. Can you translate "it depends" into your language? Try to use it in English this week.

OK. I'm going to stop there. I'll talk to you all again next time. Remember you can send your questions to me at learnenglishpodcast@britishcouncil.org. I'll be happy to answer your questions! In a moment you'll hear the address for the website where you can read everything you've heard in this podcast.

Right. That's all for this time. Bye for now! See you next time.`,
      },
      {
        id: 'bc-s1-e02',
        number: 2,
        title: 'Travel Problems',
        description: 'Tess and Ravi talk about travel problems, and their guests talk about Frida Kahlo and life in Kazakhstan.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e03',
        number: 3,
        title: 'Clothes',
        description: 'Tess and Ravi talk about clothes, and their guests talk about Jonathan Ive and women\'s football.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e04',
        number: 4,
        title: 'Families',
        description: 'Tess and Ravi talk about their families, and their guests talk about Dr Muhammed Yunus and life in Cairo.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e05',
        number: 5,
        title: 'Feeling Unwell',
        description: 'Carolina is in Newcastle, but in this episode she\'s not feeling very well.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e06',
        number: 6,
        title: 'Sports',
        description: 'Tess and Ravi talk about sports, and their guests share their experiences and opinions.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e07',
        number: 7,
        title: 'Cooking',
        description: 'Tess and Ravi talk about cooking, and their guests share recipes and food memories.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e08',
        number: 8,
        title: 'A Favour',
        description: 'Ravi asks Tess a favour, and their guests talk about David Attenborough and Christmas in Prague.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e09',
        number: 9,
        title: 'Music',
        description: 'Tess and Ravi talk about music, and their guests share their favourite songs and concerts.',
        level: 'A2',
      },
      {
        id: 'bc-s1-e10',
        number: 10,
        title: 'The Best of Series 1',
        description: 'The final episode puts together the best bits from Series 1.',
        level: 'A2',
      },
    ],
  },
];
