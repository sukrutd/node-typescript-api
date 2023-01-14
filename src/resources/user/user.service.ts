import UserModel from '@/resources/user/user.model';
import tokenUtils from '@/utils/token';

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     * @param name
     * @param email
     * @param password
     * @param role
     */
    public async register(name: string, email: string, password: string, role: string): Promise<string | Error> {
        try {
            const user = await this.user.create({ name, email, password, role });
            const accessToken = tokenUtils.createToken(user);
            return accessToken;
        } catch (err) {
            throw new Error('Unable to create user.');
        }
    }

    /**
     * Attempt to login a user
     * @param email
     * @param password
     */
    public async login(email: string, password: string): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            if (await user.isValidPassword(password)) {
                const accessToken = tokenUtils.createToken(user);
                return accessToken;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            throw new Error('Invalid credentials');
        }
    }
}

export default UserService;
