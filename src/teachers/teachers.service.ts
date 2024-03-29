import { Injectable, Logger } from '@nestjs/common';
import { CreateTeacherDto } from 'src/DTOs/create-teacher.dto';
import { supabase, TABLE_NAMES } from 'supabase.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<any> {
    const { username, isactive, idInstitute, email, password, isTeacher } = createTeacherDto;

     // Hasher le mot de passe
     const hashedPassword = await bcrypt.hash(password, 10); // 10 est le nombre de tours de hachage, 

    const { data, error } = await supabase
      .from(TABLE_NAMES.TEACHER) 
      .upsert([{ username, isactive, idInstitute, email, password: hashedPassword , isTeacher }]);

    if (error) {
      throw error;
    }

    return data;
  }

  async getAllTeacher(): Promise<any[]> {
    const { data, error } = await supabase.from(TABLE_NAMES.TEACHER).select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async updateTeacher(id: number, updatedData: any): Promise<any> {
    const { data, error } = await supabase
      .from(TABLE_NAMES.TEACHER)
      .update(updatedData)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  }

  async getTeacherById(id: number): Promise<any> {
    const { data, error } = await supabase
      .from(TABLE_NAMES.TEACHER)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteTeacherById(id: number): Promise<void> {
    const { error } = await supabase.from(TABLE_NAMES.TEACHER).delete().eq('id', id);

    if (error) {
      throw error;
    }
  }
// fonction pour trouver un utilisateur par son email , je compare ensuite le mot de passe dans auth.service.ts
  async findByEmailTeacher(email: string): Promise<any> {
    const { data, error } = await supabase
      .from(TABLE_NAMES.TEACHER)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      Logger.log('Il n\'y à aucun teacher qui à cet email : teacher service ligne 95');
    } 
    return data;
  }
}
