import type { User, PrismaClient } from "../generated/prisma";
import { Role } from "../generated/prisma";
import type { RegisterProps } from "../validator";

class AuthService {
    constructor(private prisma: PrismaClient) { }
    public async create(body: RegisterProps): Promise<{ data: User, success: boolean }> {
        const { name, email, password } = body;
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password,
                role: Role.USER,
            }
        })

        if (user) {
            return { data: user, success: true }
        }
        return { data: user, success: false }
    }
    public async login({ email, password }: { email: string, password: string }) { 
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { data: null, success: false, message: "User not found" };
        }
        if (user.password !== password) {
            return { data: null, success: false, message: "Invalid password" };
        }
        return { data: user, success: true, message: "Login successful" };
    }
}

export default AuthService