import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/client';


const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const courses = [
    {
      slug: "global-scholarship-mastery",
      title: "Global Scholarship & Interview Mastery",
      description: "Learn how to find scholarships, prepare documents, and pass international interviews — step by step.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: 30,
      currency: 'USD',
      priceETB: 3500,
      published: true,
      modules: [
        {
          title: "Scholarship search strategy & shortlisting",
          order: 1,
          lessons: [
            {
              title: "Understanding Scholarship Types",
              duration: "10:00",
              videoId: "tjXIfam5qLE",
              overview: "Learn about different types of scholarships available globally.",
              transcript: "Introduction to merit-based, need-based, and country-specific scholarships.",
              order: 1,
              resources: [
                { title: "Scholarship Database List", url: "#" },
                { title: "Search Strategy Template", url: "#" }
              ]
            },
            {
              title: "Shortlisting the Best Opportunities",
              duration: "15:00",
              videoId: "tjXIfam5qLE",
              overview: "How to filter and select scholarships that match your profile.",
              transcript: "Techniques for efficient shortlisting and organizing applications.",
              order: 2,
              resources: [
                { title: "Shortlisting Spreadsheet", url: "#" }
              ]
            }
          ]
        },
        {
          title: "Motivation letter / SOP structure",
          order: 2,
          lessons: [
            {
              title: "Structuring Your SOP",
              duration: "12:00",
              videoId: "tjXIfam5qLE",
              overview: "The ideal structure for a winning Statement of Purpose.",
              transcript: "Breakdown of introduction, body paragraphs, and conclusion.",
              order: 1,
              resources: [
                { title: "SOP Template", url: "#" },
                { title: "Winning SOP Examples", url: "#" }
              ]
            },
            {
              title: "Writing Compelling Hooks",
              duration: "08:00",
              videoId: "tjXIfam5qLE",
              overview: "How to start your essay with a strong hook.",
              transcript: "Examples of engaging opening lines.",
              order: 2,
              resources: []
            }
          ]
        },
        {
          title: "CV/Resume polishing for international reviewers",
          order: 3,
          lessons: [
            {
              title: "Academic vs. Professional CV",
              duration: "10:00",
              videoId: "tjXIfam5qLE",
              overview: "Differences between academic CVs and professional resumes.",
              transcript: "Tailoring your CV for scholarship committees.",
              order: 1,
              resources: [
                { title: "Academic CV Template", url: "#" },
                { title: "Action Verbs List", url: "#" }
              ]
            }
          ]
        },
        {
          title: "Recommendation letter guidance",
          order: 4,
          lessons: [
            {
              title: "Choosing the Right Referees",
              duration: "05:00",
              videoId: "tjXIfam5qLE",
              overview: "Who to ask for recommendation letters.",
              transcript: "Selecting referees who can vouch for your academic and personal qualities.",
              order: 1,
              resources: [
                { title: "Email Request Template", url: "#" }
              ]
            },
            {
              title: "Drafting Guidance for Referees",
              duration: "07:00",
              videoId: "tjXIfam5qLE",
              overview: "How to help your referees write strong letters.",
              transcript: "Providing bullet points and context to your referees.",
              order: 2,
              resources: [
                { title: "LOR Guidelines PDF", url: "#" }
              ]
            }
          ]
        },
        {
          title: "Interview preparation + mock questions",
          order: 5,
          lessons: [
            {
              title: "Common Interview Questions",
              duration: "20:00",
              videoId: "tjXIfam5qLE",
              overview: "Top questions asked in scholarship interviews.",
              transcript: "Analysis of common questions and how to answer them.",
              order: 1,
              resources: [
                { title: "Question Bank", url: "#" }
              ]
            },
            {
              title: "Mock Interview Practice",
              duration: "25:00",
              videoId: "tjXIfam5qLE",
              overview: "Simulated interview session.",
              transcript: "Watch a mock interview and learn from the feedback.",
              order: 2,
              resources: [
                { title: "Self-Evaluation Checklist", url: "#" }
              ]
            }
          ]
        }
      ]
    }
  ];

  for (const courseData of courses) {
    const { modules, ...course } = courseData;

    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        ...course,
        modules: {
          create: modules.map(module => ({
            title: module.title,
            order: module.order,
            lessons: {
              create: module.lessons.map(lesson => ({
                title: lesson.title,
                duration: lesson.duration,
                videoId: lesson.videoId,
                overview: lesson.overview,
                transcript: lesson.transcript,
                order: lesson.order,
                resources: {
                  create: lesson.resources.map(resource => ({
                    title: resource.title,
                    url: resource.url
                  }))
                }
              }))
            }
          }))
        }
      }
    });
    console.log(`Created course: ${createdCourse.title}`);
  }

  const exams = {
    1: {
      id: 1,
      title: "Python Programming Fundamentals",
      description: "Test your knowledge of Python basics, data structures, and object-oriented programming",
      category: "Programming",
      level: "Beginner",
      type: "Quiz",
      questions: 20,
      duration: 30,
      passingScore: 70,
      attempts: 1250,
      averageScore: 78,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
      topics: [
        "Python Syntax and Variables",
        "Data Types and Operators",
        "Control Flow (if/else, loops)",
        "Functions and Modules",
        "Lists, Tuples, and Dictionaries",
        "Object-Oriented Programming Basics",
      ],
      requirements: [
        "Basic understanding of programming concepts",
        "Familiarity with Python syntax",
        "Completed Python Basics course (recommended)",
      ],
      benefits: [
        "Validate your Python programming skills",
        "Earn a certificate upon passing",
        "Identify areas for improvement",
        "Boost your resume and LinkedIn profile",
      ],
    },
    2: {
      id: 2,
      title: "Machine Learning Certification Exam",
      description: "Comprehensive exam covering supervised learning, neural networks, and model evaluation",
      category: "Data Science",
      level: "Advanced",
      type: "Exam",
      questions: 50,
      duration: 120,
      passingScore: 75,
      attempts: 890,
      averageScore: 72,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      topics: [
        "Supervised Learning Algorithms",
        "Unsupervised Learning",
        "Neural Networks and Deep Learning",
        "Model Evaluation and Validation",
        "Feature Engineering",
        "Hyperparameter Tuning",
      ],
      requirements: [
        "Strong foundation in mathematics and statistics",
        "Experience with Python and ML libraries",
        "Completed Machine Learning course",
      ],
      benefits: [
        "Industry-recognized certification",
        "Demonstrate advanced ML expertise",
        "Career advancement opportunities",
        "Access to exclusive ML community",
      ],
    },
  };

  const examQuestions = {
    1: [
      {
        id: 1,
        question: "What is the correct way to create a list in Python?",
        options: ["list = (1, 2, 3)", "list = [1, 2, 3]", "list = {1, 2, 3}", "list = <1, 2, 3>"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "func", "define"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What does the 'len()' function do?",
        options: ["Returns the length of an object", "Converts to lowercase", "Removes whitespace", "Sorts a list"],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Which of the following is a mutable data type in Python?",
        options: ["Tuple", "String", "List", "Integer"],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "What is the output of: print(type([]))?",
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"],
        correctAnswer: 1,
      },
    ],
    2: [
      {
        id: 1,
        question: "What is the primary goal of supervised learning?",
        options: [
          "Find hidden patterns in data",
          "Learn from labeled data to make predictions",
          "Reduce dimensionality",
          "Cluster similar data points",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which algorithm is commonly used for classification tasks?",
        options: ["K-means", "PCA", "Random Forest", "DBSCAN"],
        correctAnswer: 2,
      },
    ],
  };

  for (const [id, examData] of Object.entries(exams)) {
    const questions = examQuestions[id as unknown as keyof typeof examQuestions] || [];

    // Upsert Exam
    const exam = await prisma.exam.upsert({
      where: { id: Number(id) },
      update: {},
      create: {
        title: examData.title,
        description: examData.description,
        category: examData.category,
        level: examData.level,
        type: examData.type,
        questions: examData.questions,
        duration: examData.duration,
        passingScore: examData.passingScore,
        attempts: examData.attempts,
        averageScore: examData.averageScore,
        image: examData.image,
        topics: examData.topics,
        requirements: examData.requirements,
        benefits: examData.benefits,
        examQuestions: {
          create: questions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        }
      }
    });
    console.log(`Created exam: ${exam.title}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
