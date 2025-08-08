import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

// ✅ Get all students or a single student
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const student = await prisma.student.findUnique({
      where: { student_id: Number(id) },
    });
    return NextResponse.json(student);
  }

  const students = await prisma.student.findMany();
  return NextResponse.json(students);
}

// ✅ Create / Update / Delete in a single endpoint
export async function POST(req) {
  const { action, id, name, department, roll } = await req.json();

  // Update student
  if (action === 'update' && id) {
    const updated = await prisma.student.update({
      where: { student_id: Number(id) },
      data: { name, department, roll: Number(roll) },
    });
    return NextResponse.json(updated);
  }

  // Delete student
  if (action === 'delete' && id) {
    await prisma.student.delete({
      where: { student_id: Number(id) },
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  }

  // Add new student
  const student = await prisma.student.create({
    data: { name, department, roll: Number(roll) },
  });
  return NextResponse.json(student);
}
