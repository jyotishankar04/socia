import type { User, PrismaClient } from "../../generated/prisma";
import { Role } from "../../generated/prisma";
import type { RegisterProps } from "../../shared/validators";

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
}

export default AuthService