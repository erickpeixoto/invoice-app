# In.voice
In.voice is a comprehensive invoicing solution designed to streamline the billing process and management for businesses and freelancers.

**Live Demo**: [https://invoice-app-psi-seven.vercel.app/](https://invoice-app-psi-seven.vercel.app/)

## 🎥 Video Presentation

Get a quick overview of the In.voice application in action. Click on the image below to watch the video presentation:

[![In.voice Video Presentation](https://utfs.io/f/feb5941e-c5b0-43de-b186-e2a85f46c350-6lnpx8.00.31.png)](https://www.loom.com/share/4e709962e62c4b38bbfaa123017122f9?sid=25fe7b11-7446-4571-b865-c4e8246d31cb)


## 📝 Table of Contents

- [Features](#-features)
- [Development Process](#-development-process)
- [Technologies Used](#-technologies-used)
- [Installation & Setup](#-installation--setup)
- [Contributing](#-contributing)
- [Author Information](#-author-information)

## 🚀 Features

**Invoicing Management**

- Create detailed invoices with multiple line items, tax calculations, and more.
- User-friendly interface to track and manage invoices with various statuses (Paid, Pending, Overdue).
- Easily update invoice details or line items as necessary.

**User Management**

- Integrated user scenario allowing for more personalized experiences.
- Role-based access control to define different levels of access for various users.

**Client Management**

- Dedicated pages for clients, facilitating better relationship management.
- Advanced filtering and searching capabilities for clients.

**Data Presentation**

- Interactive data tables suitable for handling both user and client data.
- Enhanced responsive design ensuring compatibility across various devices.

**Database Interactions**

- Seamless TRPC module adjustments enabling efficient database querying.
- Robust database structure backed by Planet Scale MySQL.

**Usability and Navigation**

- User-friendly invoice page design for better user experience.
- Modified navigation bar to easily accommodate various routes, including user and client pages.
- Tooltips and other user interface improvements for better clarity and understanding.

**Others**

- Incorporation of state management using Jotai for more efficient data handling.
- Streamlined routes for better application structure and URL management.
- Removal of outdated components to ensure a lean and efficient application codebase.

## 🌍 Environment Variables

For the application to run smoothly, specific environment variables need to be set. These variables allow for configuration, security, and enable various features of the application.

![Environment Variables](https://utfs.io/f/f0643ecd-e276-4652-98b8-7d9b11d69b3c-6lnpxu.39.12.png)

> Ensure you've set the correct environment variables before deploying or running the application locally. Properly managing these can enhance security and performance.

## 🛠 Agile Process Organization

For the successful execution of this project, we adopted the Agile methodology using [Linear](https://linear.app/). Linear provided a structured and straightforward platform to manage our tasks, prioritize features, and track the project's overall progress.

Below are some insights into how we utilized Linear:

![Linear Board Overview](https://utfs.io/f/57565212-7681-42e8-a7b2-b347dfd420f9-6lnpxu.35.28.png)

The board overview provides a glimpse of the ongoing tasks, completed tasks, and tasks in the backlog. This visual representation allows the team to get a quick status update of the project at any given time.

![Linear Task Detail](https://utfs.io/f/bcc300df-15b4-4de9-9afc-56c5a739e160-6lnpxu.34.56.png)

A detailed look at a specific task reveals the task's specifics, such as its description, assignee, due date, and related sub-tasks. With Linear, our team could ensure that no detail was overlooked, ensuring the highest quality output for our project.

We believe in continuous improvement, and the insights provided by Linear played a pivotal role in refining our processes and enhancing our productivity.

## 🔧 Technologies Used

- **Database**: Planet Scale MySQL
- **Hosting**: Vercel
- **File Upload Solution**: [UploadThing](https://uploadthing.com/)
- **Full-stack Framework**: [Create T3](https://create.t3.gg/)

## 🛠 Installation & Setup

To get started with the project, you'll need to follow the steps below:

1. **Clone the repository:**

```bash
git clone https://github.com/erickpeixoto/invoice-app.git
cd invoice-app
pnpm i
pnpm run dev --filter=nextjs


```

### 📦 Database Schemas

If you make any changes to the database schemas, be sure to migrate and push the changes:

```bash
pnpm run db:migrate
pnpm run db:push
```

## 👤 Author Information

**Erick Eduardo**

- **GitHub**: [erickpeixoto](https://github.com/erickpeixoto)
- **LinkedIn**: [Erick Eduardo](https://www.linkedin.com/in/erickpeixoto/)
