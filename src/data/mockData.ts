import { format, subDays, subWeeks, subMonths } from 'date-fns'

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'maintenance' | 'deprecated'
  techStack: string[]
  team: string
  totalDependencies: number
  outdatedDependencies: number
  securityScore: number
  healthScore: number
  lastScan: Date
  createdAt: Date
  updatedAt: Date
  dependencies: string[]
}

export interface Dependency {
  id: string
  name: string
  version: string
  latestVersion: string
  type: 'production' | 'development' | 'peer'
  license: string
  description: string
  status: 'up-to-date' | 'outdated' | 'deprecated'
  securityLevel: 'low' | 'medium' | 'high' | 'critical'
  vulnerabilities: Vulnerability[]
  projects: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Vulnerability {
  id: string
  cve: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  publishedDate: Date
  fixedVersion?: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'developer' | 'viewer'
  team: string
  avatar: string
}

const projectNames = [
  'CustomerPortal', 'PaymentService', 'UserAuthentication', 'DataAnalytics',
  'MobileAPI', 'WebDashboard', 'EmailService', 'FileUpload',
  'NotificationCenter', 'SearchEngine', 'ContentManager', 'AuditLogger',
  'ReportGenerator', 'BackupService', 'MonitoringSystem', 'ConfigManager'
]

const techStacks = [
  ['React', 'TypeScript', 'Node.js'],
  ['Vue.js', 'JavaScript', 'Express'],
  ['Angular', 'TypeScript', 'NestJS'],
  ['Python', 'Django', 'PostgreSQL'],
  ['Java', 'Spring Boot', 'MySQL'],
  ['C#', '.NET Core', 'SQL Server'],
  ['Go', 'Gin', 'MongoDB'],
  ['Rust', 'Actix', 'Redis']
]

const teams = [
  'Frontend Team', 'Backend Team', 'DevOps Team', 'Mobile Team',
  'Data Team', 'Security Team', 'Platform Team', 'QA Team'
]

const dependencyNames = [
  'react', 'vue', 'angular', 'lodash', 'axios', 'express', 'typescript',
  'webpack', 'babel', 'eslint', 'prettier', 'jest', 'cypress', 'tailwindcss',
  'bootstrap', 'material-ui', 'antd', 'chakra-ui', 'styled-components',
  'redux', 'vuex', 'pinia', 'rxjs', 'moment', 'date-fns', 'ramda',
  'underscore', 'jquery', 'socket.io', 'passport', 'jsonwebtoken',
  'bcrypt', 'cors', 'helmet', 'morgan', 'nodemon', 'concurrently'
]

const licenses = [
  'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC',
  'LGPL-2.1', 'MPL-2.0', 'CC0-1.0', 'Unlicense', 'BSD-2-Clause'
]

const vulnerabilityTitles = [
  'Cross-Site Scripting (XSS) vulnerability',
  'SQL Injection in query handler',
  'Remote Code Execution via file upload',
  'Authentication bypass vulnerability',
  'Prototype pollution in utility function',
  'Path traversal in file handler',
  'Denial of Service via resource exhaustion',
  'Information disclosure in error messages',
  'CSRF vulnerability in form handler',
  'Buffer overflow in parsing function'
]

export const generateMockProjects = (): Project[] => {
  return Array.from({ length: 16 }, (_, i) => {
    const outdated = Math.floor(Math.random() * 15)
    const total = outdated + Math.floor(Math.random() * 25) + 10
    const securityScore = Math.floor(Math.random() * 10) + 1
    const healthScore = Math.max(1, Math.floor((10 - outdated / 5 + securityScore) / 2 * 10))

    return {
      id: (i + 1).toString(),
      name: projectNames[i],
      description: `A modern ${projectNames[i].toLowerCase()} application built for enterprise use.`,
      status: ['active', 'maintenance', 'deprecated'][Math.floor(Math.random() * 3)] as any,
      techStack: techStacks[Math.floor(Math.random() * techStacks.length)],
      team: teams[Math.floor(Math.random() * teams.length)],
      totalDependencies: total,
      outdatedDependencies: outdated,
      securityScore,
      healthScore,
      lastScan: subDays(new Date(), Math.floor(Math.random() * 7)),
      createdAt: subMonths(new Date(), Math.floor(Math.random() * 12)),
      updatedAt: subDays(new Date(), Math.floor(Math.random() * 30)),
      dependencies: Array.from({ length: Math.floor(Math.random() * 10) + 5 }, 
        () => dependencyNames[Math.floor(Math.random() * dependencyNames.length)]
      )
    }
  })
}

export const generateMockDependencies = (): Dependency[] => {
  return dependencyNames.map((name, i) => {
    const vulnerabilityCount = Math.floor(Math.random() * 4)
    const vulnerabilities = Array.from({ length: vulnerabilityCount }, (_, j) => ({
      id: `vuln-${i}-${j}`,
      cve: `CVE-2023-${String(1000 + i + j).padStart(4, '0')}`,
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      title: vulnerabilityTitles[Math.floor(Math.random() * vulnerabilityTitles.length)],
      description: `A security vulnerability has been discovered in ${name} that could potentially be exploited by malicious actors.`,
      publishedDate: subWeeks(new Date(), Math.floor(Math.random() * 12)),
      fixedVersion: Math.random() > 0.3 ? `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}` : undefined
    }))

    const currentVersion = `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
    const latestVersion = Math.random() > 0.3 
      ? `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}`
      : currentVersion

    return {
      id: (i + 1).toString(),
      name,
      version: currentVersion,
      latestVersion,
      type: ['production', 'development', 'peer'][Math.floor(Math.random() * 3)] as any,
      license: licenses[Math.floor(Math.random() * licenses.length)],
      description: `A popular ${name} library for modern web development.`,
      status: currentVersion === latestVersion ? 'up-to-date' : 'outdated',
      securityLevel: vulnerabilityCount === 0 ? 'low' : 
                   vulnerabilities.some(v => v.severity === 'critical') ? 'critical' :
                   vulnerabilities.some(v => v.severity === 'high') ? 'high' : 'medium',
      vulnerabilities,
      projects: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, 
        () => projectNames[Math.floor(Math.random() * projectNames.length)]
      ),
      createdAt: subMonths(new Date(), Math.floor(Math.random() * 18)),
      updatedAt: subDays(new Date(), Math.floor(Math.random() * 14))
    }
  })
}

export const generateMockTeamMembers = (): TeamMember[] => {
  const names = [
    'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson',
    'Eva Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor',
    'Ivy Chen', 'Jack Anderson', 'Kate Thompson', 'Liam Garcia'
  ]

  return names.map((name, i) => ({
    id: (i + 1).toString(),
    name,
    email: name.toLowerCase().replace(' ', '.') + '@company.com',
    role: ['admin', 'manager', 'developer', 'viewer'][Math.floor(Math.random() * 4)] as any,
    team: teams[Math.floor(Math.random() * teams.length)],
    avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=40&h=40&fit=crop&crop=face`
  }))
}