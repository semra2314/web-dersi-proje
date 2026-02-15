/**
 * LoginDto
 * - Kullanıcı girişi (login) sırasında gönderilen veriler
 * - name: kayıtlı kullanıcı adı ile giriş yapılacak (email yerine)
 * - password: giriş şifresi (backend'de bcrypt ile doğrulanır)
 */
import { IsString } from 'class-validator';

export class LoginDto {
  // Kullanıcının login için kullandığı isim
  @IsString()
  name: string;

  // Kullanıcının şifresi
  @IsString()
  password: string;
}
