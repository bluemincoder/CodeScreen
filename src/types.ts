// src/types.ts
export interface CodeExample {
    input: string;
    output: string;
    explanation?: string;
}

export interface StarterCode {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
}

export interface CodeQuestion {
    id: string;
    title: string;
    description: string;
    examples: CodeExample[];
    starterCode: StarterCode;
    constraints?: string[];
}
