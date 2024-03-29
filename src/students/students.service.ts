import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from 'src/DTOs/create-student.dto';
import { supabase, TABLE_NAMES } from 'supabase.config';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common'; 

@Injectable()
export class StudentsService {
  async createStudent(createStudentDto: CreateStudentDto): Promise<any> {
    const {
      username,
      isActive,
      isPublic,
      idInstitute,
      email,
      password,
      isTeacher,
    } = createStudentDto;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10); // 10 est le nombre de tours de hachage

    const { data, error } = await supabase
      .from(TABLE_NAMES.STUDENT)
      .upsert([
        {
          username,
          isPublic,
          isActive,
          idInstitute,
          email,
          password: hashedPassword,
          isTeacher,
        },
      ]);

    if (error) {
      throw error;
    }

    return data;
  }

  async getAllStudents(): Promise<any[]> {
    const { data, error } = await supabase.from(TABLE_NAMES.STUDENT).select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  async updateStudent(id: number, updatedData: any): Promise<any> {
    const { data, error } = await supabase
      .from(TABLE_NAMES.STUDENT)
      .update(updatedData)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  }

  async getStudentById(id: number): Promise<any> {
    const { data, error } = await supabase
      .from(TABLE_NAMES.STUDENT)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteStudentById(id: number): Promise<void> {
    const { error } = await supabase.from(TABLE_NAMES.STUDENT).delete().eq('id', id);

    if (error) {
      throw error;
    }
  }
  // fonction pour trouver un utilisateur par son email , je compare ensuite le mot de passe dans auth.service.ts
  async findByEmailStudent(email: string): Promise<any> {
    const { data, error } = await supabase
      .from(TABLE_NAMES.STUDENT)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      Logger.log('Il n\'y à aucun étudiant qui à cet email : student service ligne 95');
    }

    return data;
  }
}
