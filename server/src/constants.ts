export const _purposes = {
   REGISTER: "register",
   FORGOT_PASSWORD: "forgot-password",
   RESET_PASSWORD: "reset-password"
}



// DYMMY POST TEMPLATES 
export const postsResponse = {
  message: "Here are the recent posts fetched successfully",
  content: `
# Posts Retrieved Successfully

✅ **Operation**: Fetch Recent Posts  
📊 **Status**: Success  
📅 **Timestamp**: ${new Date().toISOString()}
🔢 **Total Posts**: 10 posts retrieved
📝 **Content Type**: Mixed technical and career advice posts
🎯 **Purpose**: Community engagement and knowledge sharing

## Response Details:
- ✅ All posts loaded from database
- ✅ Metadata included for each post
- ✅ Content formatted properly
- ✅ Pagination ready for future use
- ✅ Filtering by tags available
  `,
  posts: [
    {
      id: 1,
      title: "Why Technical Skills Aren't Enough for FAANG Interviews",
      content: "Lot of candidates fail interviews despite having solid technical knowledge. After speaking with multiple interviewers at FAANG and other top companies, one thing stood out: it's not the lack of skills, but issues like poor communication, lack of confidence, and weak English fluency that often lead to rejection. Here are a few things you can do to fix this...",
      meta: {
        author: "Raj Verma",
        timestamp: "2024-01-15T10:30:00Z",
        likes: 234,
        comments: 45,
        shares: 89,
        readTime: "5 min",
        tags: ["career", "interview", "programming", "faang"]
      }
    },
    {
      id: 2,
      title: "Mastering React Hooks in 2024",
      content: "React Hooks have revolutionized how we write functional components. Understanding useState, useEffect, and custom hooks is essential for modern React development. Let me share some advanced patterns and common pitfalls to avoid...",
      meta: {
        author: "Priya Sharma",
        timestamp: "2024-01-14T14:20:00Z",
        likes: 189,
        comments: 32,
        shares: 45,
        readTime: "7 min",
        tags: ["react", "javascript", "frontend", "webdev"]
      }
    },
    {
      id: 3,
      title: "System Design Fundamentals",
      content: "Building scalable systems requires understanding core principles. From load balancers to database sharding, let's break down the essential components of system design and how they work together in real-world applications...",
      meta: {
        author: "Amit Kumar",
        timestamp: "2024-01-13T09:15:00Z",
        likes: 312,
        comments: 67,
        shares: 112,
        readTime: "10 min",
        tags: ["systemdesign", "architecture", "backend", "scalability"]
      }
    },
    {
      id: 4,
      title: "Python for Data Science",
      content: "Python has become the go-to language for data science. In this post, we'll explore pandas, numpy, and matplotlib for data manipulation and visualization. Perfect for beginners starting their data science journey...",
      meta: {
        author: "Neha Patel",
        timestamp: "2024-01-12T16:45:00Z",
        likes: 278,
        comments: 43,
        shares: 78,
        readTime: "6 min",
        tags: ["python", "datascience", "machinelearning", "analytics"]
      }
    },
    {
      id: 5,
      title: "DevOps CI/CD Pipeline Guide",
      content: "Setting up a proper CI/CD pipeline can dramatically improve your development workflow. Learn how to automate testing, deployment, and monitoring using GitHub Actions, Docker, and AWS...",
      meta: {
        author: "Sanjay Mehta",
        timestamp: "2024-01-11T11:20:00Z",
        likes: 198,
        comments: 41,
        shares: 56,
        readTime: "8 min",
        tags: ["devops", "cicd", "docker", "aws", "automation"]
      }
    },
    {
      id: 6,
      title: "Mobile App Performance Optimization",
      content: "Slow mobile apps lead to user churn. Discover techniques to optimize your React Native or Flutter apps for better performance, including image optimization, code splitting, and memory management...",
      meta: {
        author: "Anjali Singh",
        timestamp: "2024-01-10T13:10:00Z",
        likes: 167,
        comments: 29,
        shares: 34,
        readTime: "5 min",
        tags: ["mobile", "performance", "reactnative", "flutter"]
      }
    },
    {
      id: 7,
      title: "Blockchain Development Basics",
      content: "Getting started with blockchain development? Understand smart contracts, Web3.js, and how to build decentralized applications on Ethereum. This guide covers everything from setup to deployment...",
      meta: {
        author: "Rahul Joshi",
        timestamp: "2024-01-09T15:30:00Z",
        likes: 423,
        comments: 89,
        shares: 156,
        readTime: "12 min",
        tags: ["blockchain", "web3", "ethereum", "smartcontracts"]
      }
    },
    {
      id: 8,
      title: "JavaScript Async Patterns",
      content: "Master asynchronous JavaScript with modern patterns. We'll explore Promises, async/await, error handling, and how to manage complex async operations without falling into callback hell...",
      meta: {
        author: "Kiran Reddy",
        timestamp: "2024-01-08T12:05:00Z",
        likes: 212,
        comments: 38,
        shares: 67,
        readTime: "6 min",
        tags: ["javascript", "async", "promises", "webdev"]
      }
    },
    {
      id: 9,
      title: "Open Source Contribution Guide",
      content: "Want to contribute to open source but don't know where to start? This comprehensive guide walks you through finding projects, understanding codebases, making pull requests, and becoming part of the community...",
      meta: {
        author: "Vikram Malhotra",
        timestamp: "2024-01-07T17:40:00Z",
        likes: 189,
        comments: 34,
        shares: 45,
        readTime: "4 min",
        tags: ["opensource", "github", "contributing", "community"]
      }
    },
    {
      id: 10,
      title: "Remote Work Best Practices",
      content: "Thriving in remote work requires discipline and the right tools. Learn about communication strategies, time management, home office setup, and maintaining work-life balance in distributed teams...",
      meta: {
        author: "Sneha Iyer",
        timestamp: "2024-01-06T08:50:00Z",
        likes: 176,
        comments: 31,
        shares: 42,
        readTime: "5 min",
        tags: ["remotework", "productivity", "career", "worklife"]
      }
    }
  ],
  meta: {
    totalPosts: 10,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    responseTime: "128ms",
    server: "api-server-01",
    version: "1.2.0"
  }
};